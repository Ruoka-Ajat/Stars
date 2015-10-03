// Mthon 2015
// Algorithm template
// www.solinor.fi

var MTHONALGO = MTHONALGO || {};

// required base function for finding the path in <dataset>
MTHONALGO.solveStellarRoute = function(dataset) {
    var solution = {
      // path consists of id:s of the stars in the path, in linear order start->end
      // example: [23,654,234,2,64]
      path: [],
      // connections consits of individual connections between stars, identified by pairs of star ids
      // example: [[1,56],[38,62]]
      connections: [],
      // length of the path
      length: 0
    }

    // do your magic here
    var starPairs = []
    formWeb(starPairs, dataset);
    //basicWalker(parseInt(dataset["endPoint"]), dataset, starPairs, solution)
    var path = []
    var distance = []
    dijkstra(dataset, starPairs, path, distance)
    var end = dataset["endPoint"]
    
    solution.length = distance[end]
    //distance = []
    //starPairs = []
    //dataset = []
    solution.path = shortestPath(path, end)
    //fillConnections(solution)
    // required return
    return solution;
}

function fillConnections(solution)
{
    for(var i = 1; i < solution.path.length; i++)
    {
        solution.connections[i] = [solution.path[i-1], solution.path[i]]
    }
}

function shortestPath(path, endPoint)
{
    var reversePath = []
    var finalPath = []
    reversePath.push(endPoint)
    var u = path[endPoint]
    while(!(u==0))
    {
        reversePath.push(u)
        u=path[u]
    }
    reversePath.push(0)
    while(reversePath.length > 0)
    {
        finalPath.push(reversePath.pop())
    }
    return finalPath
}

function dijkstra(dataset, starPairs, path, distance)
{
    var stars = dataset["stars"]
    
    //var queue = new PriorityQueue({ comparator: function(a, b) { return a[1] - b[1]; }})
    
    initializeSingleSource(dataset, distance, path)
    
    var S = []
    for(star in stars)
    {
        star = stars[star]["_id"]
        //queue.queue([star, distance[star]])
    }
    while(S.length < stars.length)
    {
        var star = findSmallest(stars, S, distance)
        S.push(star)
        var neighbours = []
        neighbours = findNeighbours(star, dataset, starPairs,neighbours)
        for(var neighbour in neighbours)
        {
            neighbour=neighbours[neighbour][1]
            relax(star, neighbour, starPairs, distance, path)
        }
    }
}

function findSmallest(stars, S, distance)
{
    var star
    var currStar
    var shortestDist = 9999999
    for(var i = 0; i < stars.length; i++)
    {
        currStar = stars[i]["_id"]
        if(S.indexOf(currStar) == -1)
        {
            if(distance[currStar]<shortestDist)
            {
                star = currStar
                shortestDist = distance[currStar]
            }
        }
    }
    return star
}

function initializeSingleSource(dataset, distance, path)
{
    for(var i = 0; i < dataset.stars.length; i++)
    {
        distance[i] = 999999999
        path[i] = NaN
    }
    distance[0] = 0
}

function relax(u, v, starPairs, distance, path)
{
    if(distance[v] > distance[u] + getDist(u,v,starPairs))
    {
        distance[v] = distance[u] + getDist(u,v,starPairs)
        path[v] = u
    }
}

function getDist(star1, star2, starPairs)
{
    if(JSON.stringify([star1, star2]) in starPairs)
    {
        return starPairs[JSON.stringify([star1, star2])]
    }
    if(JSON.stringify([star2, star1]) in starPairs)
    {
        return starPairs[JSON.stringify([star2, star1])]
    }
    throw new Error("Failed to get distance between stars " + star1 + " and " + star2 + ".")
}

function basicWalker(endPoint, dataset, starPairs, solution)
{
    var currStar = 0
    while(parseInt(currStar) != parseInt(endPoint))
    {
        var neighbours = []
        neighbours = findNeighbours(currStar, dataset, starPairs, neighbours)
        var a = -1; //angle
        var dist = 0;
        var pair
        for(var neighbour in neighbours)
        {
            neighbour = neighbours[neighbour]
            var b = angle(getStar(currStar, dataset), getStar(neighbour[1],dataset), getStar(endPoint, dataset))
            if(b < a || a == -1)
            {
                dist = starPairs[JSON.stringify(neighbour)]
                a = b
                pair = neighbour
            }
        }
        solution["length"] = solution["length"] + dist
        solution["path"].push(pair[1])
        currStar = pair[1]
        solution["connections"].push(pair)
        console.log(currStar)
    }
    console.log("Path found!..Maybe")
}

function formWeb(starPairs, dataset)
{
    var stars = dataset["stars"]
    for(key in stars)
    {
        if(stars.hasOwnProperty(key))
        {
            var star = stars[key];
            for(var key2 in stars)
            {
                if(key2==key)
                {
                    continue;
                }
                if(stars.hasOwnProperty(key2))
                {
                    var star2 = stars[key2]
                    var dist = getDistance(star, star2)
                    if(dist < 30)
                    {
                        if(JSON.stringify([star2["_id"], star["_id"]]) in starPairs)
                        {
                            continue;
                        }
                        starPairs[JSON.stringify([star["_id"], star2["_id"]])] = parseFloat(dist)
                    }
                }
            }
        }
    }
}
// add your support functions in here
function getDistance(star1, star2)
{
    if(hasPosition(star1) && hasPosition(star2))
    {
        var star1Pos = star1["position"]
        var star2Pos = star2["position"]
        return Math.sqrt(Math.pow((star1Pos["x"]-star2Pos["x"]),2)+Math.pow((star1Pos["y"]-star2Pos["y"]),2)+Math.pow((star1Pos["z"]-star2Pos["z"]),2))
    }
    else
    {
        throw new Error("HALP!")
    }
}

function hasPosition(star)
{
    if(star.hasOwnProperty("position"))
    {
        var pos = star["position"]
        if(pos.hasOwnProperty("x") && pos.hasOwnProperty("y") && pos.hasOwnProperty("z"))
        {
            return true
        }
    }

    return false
}

function findNeighbours(star, dataset, starPairs, neighbours)
{
    var stars = dataset["stars"]
    for(var star2 in stars)
    {
        star2 = stars[star2]["_id"]
        if(JSON.stringify([star, star2]) in starPairs || JSON.stringify([star2, star]) in starPairs)
        {
            neighbours.push([star, star2])
        }
    }
    return neighbours
}

function dotproduct(star1, star2, star3)
{
    if(hasPosition(star1) && hasPosition(star2) && hasPosition(star3))
    {
        var star1Pos = star1["position"]
        var star2Pos = star2["position"]
        var star3Pos = star3["position"]
        return ((star3Pos["x"]-star1Pos["x"])*(star2Pos["x"]-star1Pos["x"]) + (star3Pos["y"]-star1Pos["y"])*(star2Pos["y"]-star1Pos["y"]) + (star3Pos["z"]-star1Pos["z"])*(star2Pos["z"]-star1Pos["z"]))
    }
    else
    {
        throw new Error("HALP!")
    }
}

function length(star1,star2)
{
    if(hasPosition(star1) && hasPosition(star2))
    {
        var star1Pos = star1["position"];
        var star2Pos = star2["position"];
        return Math.sqrt(Math.pow(star2Pos["x"]-star1Pos["x"],2)+Math.pow(star2Pos["y"]-star1Pos["y"],2)+Math.pow(star2Pos["z"]-star1Pos["z"],2));
    }
    else
    {
        throw new Error("HALP!");
    }
}

function angle(current, star, endpoint)
{
    // computes angle between lines drawn between (current,endpoint) and (current, star)
    if(hasPosition(current) && hasPosition(endpoint) && hasPosition(star))
    {
        return Math.acos(dotproduct(current,endpoint, star) / (length(current,endpoint)*length(current,star)))
    }
    else
    {
        throw new Error("HALP!")
    }
}

function getStar(id, dataset)
{
    for(key in dataset["stars"])
    {
        var star = dataset["stars"][key]
        if(star["_id"] == id)
        {
            return star
        }
    }
}
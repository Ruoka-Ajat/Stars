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
    var from = []
    var to = []
    var size = dataset.stars.length
    var neighbours = []
    while(size--) neighbours[size] = [];
    var dist = []
    console.log("Before web formation")
    formWeb(from, to, dist, neighbours, dataset);
    console.log("After web formation")
    //basicWalker(parseInt(dataset["endPoint"]), dataset, starPairs, solution)
    var path = []
    var distance = []
    dijkstra(dataset, to, from, dist, neighbours, path, distance)
    console.log("Dijkstra done")
    var end = dataset["endPoint"]
    
    solution.length = distance[end]
    //distance = []
    //starPairs = []
    //dataset = []
    solution.path = shortestPath(path, end)
    //fillConnections(solution)
    // required return
    console.log("After shortestPath()")
    console.log(solution.path)
    console.log(solution.length)
    for(var i = 1; i < solution.path.length; i++)
    {
        console.log(getDistance(getStar(solution.path[i-1], dataset), getStar(solution.path[i], dataset))) 
    }
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
    console.log(endPoint)
    //return
    //console.log(path)
    var reversePath = []
    var finalPath = []
    reversePath.push(endPoint)
    var u = path[endPoint]
    while(!(u==0))
    {
        console.log("u: " + u)
        console.log("path[u]: " + path[u])
        reversePath.push(u)
        u=path[u]
        return
    }
    reversePath.push(0)
    while(reversePath.length > 0)
    {
        console.log("Shortest path second while")
        finalPath.push(reversePath.pop())
    }
    return finalPath
}

function dijkstra(dataset, to, from, dist, neighbours, path, distance)
{
    var stars = dataset["stars"]
    
    //var queue = new PriorityQueue({ comparator: function(a, b) { return a[1] - b[1]; }})
    
    initializeSingleSource(dataset, distance, path)
    
    var S = []
    while(S.length < stars.length)
    {
        //console.log("Dijkstra while loop")
        var star = findSmallest(stars, S, distance)
        S.push(star)
        //var neighbours = [] // to/from/dist index of a connection to a neighbour
        //neighbours = findNeighbours(star, to, from,neighbours)
        //console.log("Star: " + star)
        for(var i = 0; i < neighbours[star].length; i++)
        {
            relax(neighbours[star][i], to,from,dist, distance, path)
        }
    }
}

function findSmallest(stars, S, distance)
{
    var star
    var currStar
    var shortestDist = 9999999999
    for(var i = 0; i < stars.length; i++)
    {
        currStar = stars[i]["_id"]
        if(S.indexOf(currStar) == -1)
        {
            //console.log("S.indexOf(currStar) == 1")
            //console.log(distance[currStar])
            //console.log(shortestDist)
            if(distance[currStar]<shortestDist)
            {
                console.log(distance[currStar]<shortestDist)
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

function relax(i, to,from,dist, distance, path)
{
    var v = to[i]
    var u = from[i]
    /*console.log("Relax Start")
    console.log("v: " + v)
    console.log("Distance[v]: " + distance[v])
    console.log("u: " + u)
    console.log("Distance[u]: " + distance [u])
    console.log("Dist[i]: " + dist[i])*/
    if(distance[v] > distance[u] + dist[i])
    {
        distance[v] = distance[u] + dist[i]
        path[v] = u
        console.log("DISTANCE CHANGED!")
        console.log("distance[" + v + "]: " + distance[v])
        console.log("path["+v+"]: " + path[v])
    }
}

function getDist(star1, star2, starPairs) //Deprecated?
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
        var neighbours = [] // neighbour changed to just a single star id, this is currently broken!
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

function formWeb(from, to, dist, neighbours, dataset)
{
    var stars = dataset["stars"]
    for(var key in stars)
    {
        console.log("Am I stuck here?")
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
                    var tempDist = getDistance(star, star2)
                    if(tempDist < 30)
                    {
                        from.push(star._id)
                        to.push(star2._id)
                        dist.push(tempDist)
                        neighbours[star._id].push(star2._id)
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

function findNeighbours(star, to, neighbours)
{
    for(var i = 0; i < to.length; i++)
    {
        if(to[i] == star)
        {
            neighbours.push(i)
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
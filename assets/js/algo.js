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
    basicWalker(parseInt(dataset["endPoint"]), dataset, starPairs, solution)
    
    // required return
    return solution;
}

function basicWalker(endPoint, dataset, starPairs, solution)
{
    var currStar = 0
    while(parseInt(currStar) != parseInt(endPoint))
    {
        var neighbours = []
        neighbours = findNeighbours(currStar, dataset, starPairs, neighbours)
        var dist = -1
        var pair
        for(var neighbour in neighbours)
        {
            console.log("I happen!")
            if(starPairs[JSON.stringify(neighbour)] < dist || JSON.stringify([neighbour[1],neighbour[0]]) < dist || dist == -1)
            {
                dist = starPairs[JSON.stringify(neighbour)]
                pair = neighbour
                console.log(pair)
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
                    var dist = distance(star, star2)
                    if(dist < 30)
                    {
                        if(JSON.stringify([star2["_id"], star["_id"]]) in starPairs)
                        {
                            continue;
                        }
                        starPairs[JSON.stringify([star["_id"], star2["_id"]])] = dist
                    }
                }
            }
        }
    }
}
// add your support functions in here
function distance(star1, star2)
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
            console.log("Added neighbour")
            neighbours.push([star, star2])
        }
    }
    return neighbours
}

function dotproduct(star1, star2)
{
    if(hasPosition(star1) && hasPosition(star2))
    {
        var star1Pos = star1["position"]
        var star2Pos = star2["position"]
        return (star1Pos["x"]*star2Pos["x"] + star1Pos["y"]*star2Pos["y"] + star1Pos["z"]*star2Pos["z"])
    }
    else
    {
        throw new Error("HALP!")
    }
}

function length(star1)
{
    if(hasPosition(star1))
    {
        var star1Pos = star1["position"];
        return Math.sqrt(Math.pow(star1Pos["x"],2)+Math.pow(star1Pos["y"],2)+Math.pow(star1Pos["z"],2));
    }
    else
    {
        throw new Error("HALP!");
    }
}

function angle(star1, star2)
{
    if(hasPosition(star1) && hasPosition(star2))
    {
        return Math.acos(dotproduct(star1,star2) / (length(star1)*length(star2)))
    }
    else
    {
        throw new Error("HALP!")
    }
}

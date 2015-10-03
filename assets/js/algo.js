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
    var banList = [] 
    var currStar = 0
    var ii = 1;
    path_old = solution["path"];
    
    while(parseInt(currStar) !== parseInt(endPoint))
//for (i = 0; i < 14; i++)
    {
        var neighbours = []
        neighbours = findNeighbours(currStar, dataset, starPairs, neighbours)
        var a = -1; //angle
        var a2 = 0;
        var dist = 0;
        var pair;
        for(var neighbour in neighbours)
        {
            console.log("Luupin kulma " + b)
                console.log("pienin kulma " + a)
               console.log(solution["path"].indexOf(neighbour[1]))
            neighbour = neighbours[neighbour]
            var b = angle(getStar(currStar, dataset), getStar(neighbour[1],dataset), getStar(endPoint, dataset))
            if(b < a  || a == -1 )
            {
                
            if (banList.indexOf(neighbour[1]) === -1)
            {
                dist = starPairs[JSON.stringify(neighbour)]
                a = b
//                if (currStar in solution["path"] && !neighbour[1] in solution["path"])
//                solution["path"].indexOf(currStar) != -1
//                {
//                a2 = b
//                }
                pair = neighbour
            }   
            }
            ii = ii + 1
            
    console.log(ii)
        }
        
        if (solution["path"].indexOf(pair[1]) != -1)
        {
        banList.push(currStar)
         console.log("banniilista " + banList)
    } 
        solution["length"] = solution["length"] + dist
        
        solution["path"].push(pair[1])
        //path_old[path_old.length] = 0
        currStar = pair[1]
        solution["connections"].push(pair)
        console.log("Nykyinen tähti " + currStar)
        console.log("Naapureiden määrä " + neighbours.length)
        console.log("etäisyys " + starPairs[JSON.stringify(neighbour)])
        console.log("polku " + solution["path"])
           console.log("polkuvanha3 " + path_old)
           
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

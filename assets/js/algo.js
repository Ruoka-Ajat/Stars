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
    console.log("Blaa!")
    
    // required return
    return solution;
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
                    var star2 = stars[key]
                    var dist = distance(star, star2)
                    if(dist < 30)
                    {
                        if([star2, star] in starPairs)
                        {
                            continue;
                        }
                        starPairs[[star, star2]] = dist
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
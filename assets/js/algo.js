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
    for(key in dataset["stars"])
    {
        if(dataset["stars"].hasOwnProperty(key))
        {
            var star = dataset["stars"][key];
            for(key2 in dataset["stars"])
            {
                if(dataset["stars"].hasOwnProperty(key2))
                {
                    var star2 = dataset["stars"][key2];
                    console.log(distance(star,star2))
            
                }
            }
        }
    }
    // required return
    return solution;
}

// add your support functions in here
function distance(star1, star2)
{
    if(hasPosition(star1) && hasPosition(star2))
    {
        star1 = star1["position"]
        star2 = star2["position"]
        return Math.sqrt(Math.pow((star1["x"]-star2["x"]),2)+Math.pow((star1["y"]-star2["y"]),2)+Math.pow((star1["z"]-star2["z"]),2))
    }
    else
    {
        throw new Error("HALP!")
    }
}

function hasPosition(star)
{
    var pos = star["position"]
    if(pos.hasOwnProperty("x") && pos.hasOwnProperty("y") && pos.hasOwnProperty("z"))
    {
        return true
    }
    return false
}
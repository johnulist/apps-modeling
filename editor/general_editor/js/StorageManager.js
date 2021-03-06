function StorageManager(){}



StorageManager.prototype.saveScene = function()
{
    var sceneDataDSL = "# scene data exported from X3DOM component editor\n";
    var positivePrimitivesJSON = [];
    var negativePrimitivesJSON = [];

    var that = this;

    //get the scene data from the primitive manager
    primitiveManager.getSceneData(positivePrimitivesJSON, negativePrimitivesJSON);

    //go through all positive primitives:
    //write each primitive's creation command and transform
    Array.forEach(positivePrimitivesJSON, function(prim){
        //@todo: replace with matching primType
        sceneDataDSL += that.primitiveInDSL(prim.id, prim.type, prim.parameters);

        sceneDataDSL += prim.id + " = translate_shape(" + prim.id + "," + that.vectorInDSL(prim.tX, prim.tY, prim.tZ)+ ")\n";

        //sceneDataDSL += "rotate_shape(" + prim.id + ", Vector(" + prim.tX ", " + prim.tY + ", " + prim.tZ + "))";
        //@todo: pythonOCC allows scaling with origin and a single scalar factor
        //sceneDataDSL += "scale_shape(" + prim.id + ", Vector(" + prim.tX ", " + prim.tY + ", " + prim.tZ + "))";

        //@todo: only debugging
        sceneDataDSL += "affiche(" + prim.id + ")\n";
    });

    //do the same for all negative primitives and use them for subtraction
    //...

    //@todo: coord system orientation

    console.log("Scene Data in DSL:");
    console.log(sceneDataDSL);
};



StorageManager.prototype.vectorInDSL = function(x, y, z){
    return "Vector(" + x + ", " + y + ", " + z + ")";
};


StorageManager.prototype.primitiveInDSL = function(id, primType, parameters){
    var that = this;

    var dslCommands = "";

    var paramValueMap = {};
    var i;
    var param;
    var val;

    for (i = 0; i < parameters.length; ++i)
    {
        param = parameters[i];
        val   = null;

        switch (param.type)
        {
            case "bool":
            case "spinner":
                val = param.value;
                break;

            case "vec3":
                (function(){
                var splitStr = param.value.split(",");
                val = new x3dom.fields.SFVec3f(splitStr[0], splitStr[1], splitStr[2]);
                })();
                break;

            default:
                break;
        }

        paramValueMap[param.editorName] = val;
    }


    switch (primType)
    {
        //box, cylinder and cone are the trivial cases
        case "Box":
            dslCommands = id + " = make_box(" + paramValueMap["Size"].x + ", " + paramValueMap["Size"].y + ", " + paramValueMap["Size"].z + ")\n";
            break;

        case "Cylinder":
            dslCommands = id + " = make_cylinder(" + (paramValueMap["Radius"] * 2.0) + "," + paramValueMap["Height"] + ")\n";
            break;

        case "Cone":
            dslCommands = id + " = make_cone(" + paramValueMap["Bottom Radius"] + "," + paramValueMap["Top Radius"] + ","+ paramValueMap["Height"] + ")\n";
            break;

        //construct dish by scaling a sphere and subtracting a cylinder from it
        case "Dish":
            (function(){
                var id_cut = id + "_cut";

                //create sphere
                dslCommands = id + " = make_sphere(" + (paramValueMap["Diameter"] * 0.5) + ")\n";

                //scale, if the radius parameter has been specified
                if (paramValueMap["Radius"] != 0)
                {
                    //@todo: here, we currently have a problem:
                    // //it is impossible to specify a non-uniform scale operation in DSL
                    //dslCommands += id + " = scale_shape(" + id + ", " + that.vectorInDSL(0, 0, 0) + "," + PROBLEM + ");"
                }

                dslCommands += id_cut + " = make_cylinder(" + paramValueMap["Diameter"] + ", " + (paramValueMap["Diameter"] * 0.5) + ")\n";
                dslCommands += id_cut + " = translate_shape(" + id + "_cut, " + that.vectorInDSL(0, 0, -paramValueMap["Diameter"] * 0.5) + ")\n";
                dslCommands += id + "= cut_shapes(" + id + ", " + id + "_cut)\n";

            })();
            break;

        case "":
            break;

        case "":
            break;

        case "":
            break;

        case "":
            break;

        case "":
            break;

        case "":
            break;

        //the two free form primitives can not be implemented that easily with DSL,
        //they are currently left out and cannot be exported
        case "Extrusion":
            //...
            break;

        case "Solid of Revolution":
            //...
            break;

        default:;
    }

    return dslCommands;
};

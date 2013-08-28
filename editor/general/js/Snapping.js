/*
 * 
 */

/* set und get der Position der Elemente
ui.BBTransX.set(pos.x.toFixed(3));
ui.BBTransY.set(pos.y.toFixed(3));
ui.BBTransZ.set(pos.z.toFixed(3));

ui.BBTransX.get();
ui.BBTransY.get();
ui.BBTransZ.get();   
*/
	
function Snapping()
{	
	var pfad;				/* Json File from primitive */
	var point1;				/* Element1 */
	var point2;				/* Element2 */
	var actualObject;		/* Object actual element */
	var actualObjectID;		/* ID actual object */
	var objListID = [];		/* IDs all elements in view */


	/*
	 * 
	 */
	this.init = function()
	{
		var pfad = './x3d/JsonFiles/Box.json';
		var objListID = primitiveManager.getIDList();

		
		/* add points */
		for(var i = 0; i < objListID.length; i++)
		{
			loadJSON(objListID[i], pfad);
			console.log(objListID[i]);
		}
		
		point1 = primitiveManager.getPosition(objListID[0]);
		point2 = primitiveManager.getPosition(objListID[1]);
		
		snapping.snap(objListID);
	};
	
	
	/*
	 * 
	 */
	this.snap = function(list)
	{
		distance = pointsDistance(point1, point2);
		actualObject = primitiveManager.getCurrentPrimitive();
		actualObjectID = primitiveManager.getCurrentPrimitive ().id;

		/*
		 * Check which item is selected and compared to the other element
		 */		
		if(actualObjectID === list[0])
		{
			if(distance < 2)
			{
				console.log("Obj1 to Obj2");
				actualObject.setAttribute('translation', '' + point2.x + point2.y + point2.z + '');
			}
		}
		else
		{
			if(distance < 2)
			{
				console.log("Obj2 to Obj1");
				actualObject.setAttribute('translation', '' + point1.x + point1.y + point1.z + '');
			}
		}
	};
	
	
	/*
	 * calculate distance
	 * @return distance between two points
	 */
	function pointsDistance(point1, point2)
	{
		var distance;
		
		var summ = ((point1.x - point2.x) * 2) + ((point1.y - point2.y) * 2) + ((point1.z - point2.z) * 2);
		
		if(summ < 0)
		{
			summ = summ * (-1);
			distance = Math.sqrt(summ);
		}
		if(summ == 0)
		{
			distance = summ;
		}
		else
		{
			distance = Math.sqrt(summ);
		}
		
		console.log("distance: " + distance);
		
		return distance;
	};
	
	
	/* Draws point */
    function point(id, pfad, translation)
    {    	
    	var transform = document.createElement('Transform');
    	var transform_S = document.createElement('Shape');
    	var transform_S_A = document.createElement('Appearance');
    	var transform_S_A_M = document.createElement('Material');    	
    	var transform_S_A_M_S = document.createElement('Sphere');
    	
    	transform_S_A_M_S.setAttribute('radius', '0.025');
    	transform_S_A_M.setAttribute('diffuseColor', '#3FFFFF');
    	transform.setAttribute('translation', translation);
    	transform.setAttribute('id', 'snapPoint');
    	
    	transform_S_A.appendChild( transform_S_A_M );
    	transform_S.appendChild( transform_S_A_M_S );
    	transform_S.appendChild( transform_S_A );
    	transform.appendChild( transform_S );
    	
    	var element = document.getElementById('mt_' + id);
    	element.appendChild(transform);
    };
    
    
    /* Draws the normaleaxis and directionaxis */
    function axis(id, pfad, translationCyl, translationCone, rotation, heightA)
    {		
		/* Cylinder */	
    	var transform = document.createElement('Transform');
    	var transform_S = document.createElement('Shape');
    	var transform_S_A = document.createElement('Appearance');
    	var transform_S_A_M = document.createElement('Material');    	
    	var transform_S_A_M_S = document.createElement('Cylinder');
    	
    	transform_S_A_M_S.setAttribute('radius', '0.005');
    	transform_S_A_M_S.setAttribute('height', heightA);
    	    	    	
    	transform_S_A_M.setAttribute('diffuseColor', '#3FFFFF');
    	transform.setAttribute('rotation', rotation);
    	transform.setAttribute('translation', translationCyl);
    	transform.setAttribute('id', 'axisNormale');

    	transform_S_A.appendChild( transform_S_A_M );
    	transform_S.appendChild( transform_S_A_M_S );    	
    	transform_S.appendChild( transform_S_A );
    	transform.appendChild( transform_S );
    	
    	
    	/* Cone */
    	var transform2 = document.createElement('Transform');
    	var transform_S2 = document.createElement('Shape');
    	var transform_S_A2 = document.createElement('Appearance');
    	var transform_S_A_M2 = document.createElement('Material');    	
    	var transform_S_A_M_S2 = document.createElement('Cone');
    	
    	transform_S_A_M_S2.setAttribute('height', '0.05');
    	transform_S_A_M_S2.setAttribute('bottomRadius', '0.05');
    	    	    	
    	transform_S_A_M2.setAttribute('diffuseColor', '#3FFFFF');
    	transform2.setAttribute('rotation', rotation);
    	transform2.setAttribute('translation', translationCone);
    	transform2.setAttribute('id', 'axisNormale');

    	transform_S_A2.appendChild( transform_S_A_M2 );
    	transform_S2.appendChild( transform_S_A_M_S2 );    	
    	transform_S2.appendChild( transform_S_A2 );
    	transform2.appendChild( transform_S2 );
    	
    	
    	var element = document.getElementById('mt_' + id);
    	element.appendChild(transform2);
    	element.appendChild(transform);
    };
    
    
	function loadJSON(id, pfad)
    {
	    // json-string load
		var json = GetHttpText(pfad);
		
		// make a string from array
		var jsonObj = eval ('(' + json + ')');
		
		// the array can be accessed as follows points[0]
		var points = jsonObj.snapPoints;		
		
		// Create point
		point(id, pfad, points[0].toString());
		
		// create axis
		axis(id, pfad, points[1].toString(), points[2].toString(), points[3].toString(), 1);
		axis(id, pfad, points[4].toString(), points[5].toString(), points[6].toString(), 1);
    };

	
	function GetHttpText(url) 
	{
		if (window.XMLHttpRequest) 
		{
			vHTTPReq = new XMLHttpRequest();
		}
		else 
		{
			vHTTPReq = new ActiveXObject("Microsoft.XMLHTTP"); // IE 5 / 6
		}
	
		/// get content
		vHTTPReq.open("GET", url, false);
		vHTTPReq.send();
	
		return vHTTPReq.responseText;
	};
}
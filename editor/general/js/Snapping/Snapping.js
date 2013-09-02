/*
 * 
 */
function Snapping()
{
	this.init = function()
	{
		setSnapping();
	};
	
    /*
     * Observers properties are added to any existing element
     */
    function setSnapping()
    {
    	elementList = [];
    	elementList = primitiveManager.getIDList();
    	
    	// Observer-Objects
    	var snapObserver = new SnapObserver();
    	var snapSubject = new SnapSubject();
    	
	    if(elementList.length != null)
	    {
	    	for(var i = 0; i < elementList.length; i++)
	    	{
	    		element = document.getElementById(elementList[i]);
	    		 		
	    		//Subject is observed
		        SnapInherits(snapSubject, element);
		        //Added onclick      
				element["onmousedown"] = new Function("element.Report(primitiveManager.getCurrentPrimitiveID())");
				
								
		 		//Observer what makes Subject
				SnapInherits(snapObserver, element); 				
		        //Updates the changed parameters
    	    	element.Update = function( myPosition, postPosition )
    	    	{
    	    		try
    	    		{
    	    			var distance = snapping.getDistance( myPosition, postPosition );
    	    			console.log(distance);
    	    		}
    	    		catch(event)
    	    		{
    	    			console.log(event);
    	    		}
    	    		 
    	    	};
		        //Added to Observer list 
		        element.AddObserver(element);
	    	}
	    }
    };
    
   
    /*
     * Calculated distance to the elements
     */
    this.getDistance = function( myPosition, postPosition )
    {
    	distance = ((postPosition.x - myPosition.x) * (postPosition.x - myPosition.x)) +
    			   ((postPosition.y - myPosition.y) * (postPosition.y - myPosition.y)) +
    			   ((postPosition.z - myPosition.z) * (postPosition.z - myPosition.z));
    	
    	result = Math.sqrt(distance);
    	return result;
    };
}

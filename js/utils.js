	// Questo per poter fare una chiamata del tipo:
   // $('.xxx').reverse().each(function () {});
   jQuery.fn.reverse = [].reverse;
   
   // Questo per poter utilizzare una chiamata del tipo
   // $(selector).exists()
   jQuery.fn.exists = function(){return this.length>0;}
   
   
   
   function roundDecimals(val, num_decimals){
      num_decimals = num_decimals || 0;
      var m = Math.pow(10, num_decimals);
      return Math.round(val * m) / m;
   }
   
   
   function dynamicSort(property)
   {
      var sortOrder = 1;
      if(property[0] === "-") {
         sortOrder = -1;
         property = property.substr(1, property.length - 1);
      }
      return function (a,b) {
         var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
         return result * sortOrder;
      }
   }
   
   function dynamicSortMultiple()
   {
      /*
       * save the arguments object as it will be overwritten
       * note that arguments object is an array-like object
       * consisting of the names of the properties to sort by
       */
      var props = arguments;
      return function (obj1, obj2) {
         var i = 0, result = 0, numberOfProperties = props.length;
         /* try getting a different result from 0 (equal)
         * as long as we have extra properties to compare
         */
         while(result === 0 && i < numberOfProperties) {
            result = dynamicSort(props[i])(obj1, obj2);
            i++;
         }
         return result;
      }
   }
   
   
   
   // Cerca un oggetto all'interno di "arr" con i parametri "params"
   // Se lo trova ritorna la posizione nell'array
   function findArrayObject(arr, params)
   {
      var found;
      var index;
      
      for (index in arr)
      {
         found = true;
         for (var key in params)
         {
            if (arr[index][key] != params[key])
               found = false;
         }
         if (found)
            return index;
      };
      return false;
   }
   
   
   // Cerca un oggetto all'interno di "arr" con i parametri "params"
   // Se lo trova ritorna l'oggetto
   function getArrayObject(arr, params)
   {
      var found;
      var index;
      
      for (index in arr)
      {
         found = true;
         for (var key in params)
         {
            if (arr[index][key] != params[key])
               found = false;
         }
         if (found)
            return arr[index];
      };
      return false;
   }
   
   
   // Conta il numero di oggetti all'interno di "arr" con i parametri "params"
   function countArrayObjects(arr, params)
   {
      var found;
      var num = 0;
      
      for (index in arr)
      {
         found = true;
         for (var key in params)
         {
            if (arr[index][key] != params[key])
               found = false;
         }
         if (found)
            num++;
      };
      return num;
   }
   
   
   // Cerca un oggetto all'interno di "arr" con i parametri "params"
   // Se lo trova ritorna l'ID dell'oggetto
   function getArrayObjectID(arr, params)
   {
      var found;
      var index;
      
      for (index in arr)
      {
         found = true;
         for (var key in params)
         {
            if (arr[index][key] != params[key])
               found = false;
         }
         if (found)
            return index;
      };
      return false;
   }
   
   
   function getArrayProperty(arr, params, property)
   {
      var found;
      var index;
      
      for (index in arr)
      {
         found = true;
         for (var key in params)
         {
            if (arr[index][key] != params[key])
               found = false;
         }
         if (found && arr[index].hasOwnProperty(property))
            return arr[index][property];
      };
      return false;
   }
   
   
   function removeArrayObject(arr, search_params)
   {
      var found;
      var i = arr.length;
      while (i--)
      {
         found = true;
         for (var key in search_params)
         {
            if (arr[i][key] != search_params[key])
               found = false;
         }
         
         // Se ho trovato l'elemento, lo elimino
         if (found)
            arr.splice(i,1);
      }
   }
   
   
   
   // Aggiornamento delle proprietà (contenute nell'oggetto passato "properties") dell'oggetto
   // presente all'interno dell'array di oggetti "arr" che soddisfa i parametri in search_params
   // ES: updateArrayObject(transitions, {id_transition:, 101}, {left:40, width:800});
   function updateArrayObject(arr, search_params, properties)
   {
      var found;
      for (var i in arr)
      {
         // Controllo se l'elemto i dell'array soddisfa tutti i parametri in search_params
         found = true;
         for (var key in search_params)
         {
            if (arr[i][key] != search_params[key])
               found = false;
         }
         
         // Se ho trovato l'elemento, aggiorno i parametri properties
         if (found)
         {
            for (var key in properties)
               //if (arr[i].hasOwnProperty(key))
                  arr[i][key] = properties[key];
         }
      }
   }
   
   
   
   function clone(obj)
   {
      return JSON.parse(JSON.stringify(obj));
   }
   
   
   
   function getArrayMax(arr, field)
   {
      var max = -1;
      $.each(arr, function(index, value) {
         if (value[field] > max)
            max = value[field];
      });
      return max;
   }
   
   
   
   
   function hexToRgb(hex) {
      // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function(m, r, g, b) {
         return r + r + g + g + b + b;
      });
   
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
         r: parseInt(result[1], 16),
         g: parseInt(result[2], 16),
         b: parseInt(result[3], 16)
      } : null;
   }
   
   function componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
   }
   
   function rgbToHex(r, g, b) {
      return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
   }
   
   
   function validEmail(email)
   {
  		return  /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+.([a-zA-Z])+([a-zA-Z])+/.test(email);
  	}

   function hasExtension(fileName, exts) 
   {
    	return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
	}

	function getUrlVars()
	{
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++)
		{
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	}
	
	// traduzioni
	function setTranslate()
	{		
		$.each(traduzioni, function (section, index)
		{
			$.each(index, function (label, value)
			{
				$("#l_" + section + "_" + label).html(value);
			});
		});
	}

   function openLoading(element)
   {
      $(element).show();
   }

   function closeLoading(element)
   {
      $(element).hide();
   }   
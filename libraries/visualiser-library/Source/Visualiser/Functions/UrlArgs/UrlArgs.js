export function getUrlArgs(){
	// Read from the URL:
	var search = global.location.search;
	
	// Defaults:
	var searchArgs = {
		viewMode: 'tile',
		tileId: 2,
		colourId: 0,
		sidingId: 1
	};
	
	if(search.length){
		var args = search.substring(1).split('&');
		for(var i=0;i<args.length;i++){
			var pieces = args[i].split('=');
			searchArgs[pieces[0]] = pieces.length > 1 ? decodeURIComponent(pieces[1]) : true;
		}
	}
	
	return searchArgs;
}

export function buildUrl(changes){
	var current = getUrlArgs();
	var updated = {...current, ...changes};
	var str = '';
	for(var key in updated){
		if(str.length){
			str += '&';
		}
		str += key + '=' + encodeURIComponent(updated[key]);
	}
	return '?' + str;
}

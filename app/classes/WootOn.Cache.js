WootOn.Cache = {
	data: false,
	
	set: function(name , val)
	{
		if (!WootOn.Cache.data)
		{
			WootOn.Cache.data = [];
		}
		WootOn.Cache.data[name] = val;
	},
	
	get: function(name)
	{
		if (!WootOn.Cache.data)
		{
			WootOn.Cache.data = [];
			return false;
		}
		
		return WootOn.Cache.data[name] || false;
	}
}
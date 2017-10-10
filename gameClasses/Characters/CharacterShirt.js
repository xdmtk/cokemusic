// Define our player character shirt container classes
var CharacterShirt = IgeEntity.extend({
	classId: 'CharacterShirt',

	init: function (container) {
		var self = this, fps;
		IgeEntity.prototype.init.call(this);
		
		//Set the container (body)
		self._container = container;

		//Create the entity
		self.isometric(true)
			.addComponent(AnimatorComponent)
			.depth(3)
			//.bounds3d(45, 45, 45)
			.anchor(0, container.data('anchorY'));


		//Make a copy of our texture and assign it
		self._ourTexture = ige.gameTexture.shirt[container.data('shirt_style')];
		self.setTexture();

		//Setup color
		self.setColor('#A81313');

		//Spawn left shirt sleve
		self.leftSleve = new CharacterLeftSleve(container, self);

		//Spawn right shirt sleve
		self.rightSleve = new CharacterRightSleve(container, self);

		//Listen for the changeDirection event so we can change
		//the shirt direction
		container.on('onChangedDirection', function (ctn, dir) { self.changedDirection(ctn, dir); });
		container.on('onRest', function() { self.rest(); });

		//Finally mount to the container (body)
		self.mount(container);
	},

	changedDirection: function(container, direction) {
		this._scale.x = 1;

		switch(direction) {
			case 'NW': this._scale.x = -1; 	
			case 'NE': 
				this.setTexture(0);  
			break;

			case 'W' : this._scale.x = -1; 	
			case 'E' : 
				this.setTexture(1);  
			break;

			case 'SW': this._scale.x = -1; 	
			case 'SE' : 
				this.setTexture(2);  
			break;

			case 'S' : 
				this.setTexture(3);  
			break;

			case 'N' : 
				this.setTexture(7);  
			break;	
		}

		this.animation.select(direction);
	},

	setTexture: function(dir, subDir) {
		if(dir === undefined)
			dir = '3';
		if(subDir === undefined)
			subDir = 0;

		dir = this._container.directionToInt(dir);
		
		var	start 		= 'h',
			action		= 'std',
			part 		= 'ch',
			style 		= this._container.data('shirt_style'),
			direction 	= dir,
			subsection  = subDir;

		// this.texture(ige.gameTexture.people.textureFromCell(start+'_'+action+'_'+part+'_'+style+'_'+direction+'_'+subsection+'.png'))
		// 					//.cellById(start+'_'+action+'_'+part+'_'+style+'_'+direction+'_'+subsection+'.png')
		// 					.dimensionsFromCell();

		this.texture(this._ourTexture)
			.cellById(start+'_'+action+'_'+part+'_'+style+'_'+direction+'_'+subsection+'.png')
			.dimensionsFromCell();
	},

	rest: function() {
		this.animation.stop();
	},

	setColor: function(colorSelection) {
		this._texture.applyFilter(IgeFilters.multiply, {color: colorSelection});
	}
});
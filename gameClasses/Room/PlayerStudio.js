var PlayerStudio = Room.extend({
	init : function (type, owner) {
		var self = this;

		self.type(type);
		self.owner(owner);
	},

	/**
	 * Gets / sets the game scene
	 **/
	gameScene : function (gamescene) {
		if(gamescene !== undefined)	{
			this._gameScene = gamescene;
			return this;
		}

		return this._gameScene;
	},

	/**
	 * Gets / sets the object scene
	 **/
	objectScene : function (objscene) {
		if(objscene !== undefined) {
			this._objScene = objscene;
			return this;
		}

		return this._objScene;
	},

	/**
	 * Gets / sets the current tile map
	 **/
	tileMap : function (tilemap) {
		if(tilemap !== undefined) {
			this._tilemap = tilemap;
			return this;
		}

		return this._tilemap;
	},

	/**
	 * Gets / sets the current collision map
	 **/
	collisionMap : function (colmap) {
		if(colmap !== undefined)	
			this._colmap = colmap;

		return this._colmap;
	},

	/**
	 * Gets / sets the current texture map
	 **/
	textureMap : function (textmap) {
		if(textmap !== undefined) {
			this._texmap = textmap;
			return this;
		}

		return this._texmap;
	},


	/**
	 * Gets / sets the current studio type
	 **/
	type : function (type) {
		if(type !== undefined) {
			this._type = type;

			//Set the actual object that stores all the data
			//from assets/rooms/rooms.js
			if(ROOMS[this._type] !== undefined) {
				this.object = ROOMS[this._type];
				this._width = this.object['width'];
				this._height = this.object['height'];
			}

			return this;
		}

		return this._type;
	},

	/**
	 * Gets / sets the current owner
	 **/
	owner : function (owner) {
		if(owner !== undefined)	{
			this._owner = owner;
			return this;
		}

		return this._owner;
	},

	/**
	 * Render tiles and paint tiles
	 **/
	render : function() {
		if(this.object === undefined)
			return;

		var self = this;

		// Create the game scene
		self._gameScene = new IgeScene2d()
			.id('gameScene')
			.translateTo(self.object['x_offset'], self.object['y_offset'], 0)
			.ignoreCamera(true)
			.drawBounds(false)
			.drawBoundsData(false)
			.mount(ige.$('baseScene'));

		// Create the object scene
		self._objScene = new IgeScene2d()
			.id('objectScene')
			.translateTo(self.object['x_offset'], self.object['y_offset'], 0)
			.drawBounds(false)
			.drawBoundsData(false)
			.ignoreCamera(true)
			.mount(self._gameScene);

		// Create an isometric tile map
		self._tilemap = new GameMap()
			.id('tileMap1')
			.drawBounds(false)
			.drawBoundsData(false)
			.translateTo(self.object['x_offset'], self.object['y_offset'], 0)
			.isometricMounts(true)
			.tileWidth($TILESIZE)
			.tileHeight($TILESIZE)
			.gridSize(self.object['width'], self.object['height'])
			.drawGrid(false)
			.drawMouse(true)
			.gridColor('transparent')
			.hoverStrokeColor($HOVER_TILE_COLOR)
			.hoverColor($HOVER_TILE_BG_COLOR)
			.highlightOccupied($HIGHLIGHT_OCCUPIED)
			.mount(self._objScene);

		// Create an isometric left wall
		// self._leftWall = new GameWall()
		// 	.id('leftWall')
		// 	.drawBounds(false)
		// 	.drawBoundsData(false)
		// 	.translateTo(self.object['x_offset'], self.object['y_offset'], 0)
		// 	.isometricMounts(true)
		// 	.tileWidth($TILESIZE)
		// 	.tileHeight($TILESIZE_WALL)
		// 	.gridSize(3, self.object['height'])
		// 	.drawGrid(false)
		// 	.drawMouse(true)
		// 	.gridColor('transparent')
		// 	.hoverStrokeColor($HOVER_TILE_COLOR)
		// 	.hoverColor($HOVER_TILE_BG_COLOR)
		// 	.highlightOccupied($HIGHLIGHT_OCCUPIED)
		// 	.mount(self._objScene);

		// self._texWallMap = new IgeTextureMap()
		// 	.translateTo(self.object['x_offset'], self.object['y_offset'], 0)
		// 	.tileWidth($TILESIZE)
		// 	.tileHeight($TILESIZE_WALL)
		// 	.gridSize(3, self.object['height'])
		// 	.gridColor('#470930')
		// 	.drawGrid($DRAW_GRIDLINES)
		// 	.drawMouse(false)
		// 	.autoSection(self.object['width'])
		// 	.drawSectionBounds(false)
		// 	.isometricMounts(true)
		// 	.mount(self._leftWall);

		// Create the texture map
		self._texMap = new IgeTextureMap()
			.id('textureMap')
			.translateTo(self.object['x_offset'], self.object['y_offset'], 0)
			.tileWidth($TILESIZE)
			.tileHeight($TILESIZE)
			.gridSize(self.object['width'], self.object['height'])
			.gridColor('#470930')
			.drawGrid($DRAW_GRIDLINES)
			.drawMouse(false)
			.autoSection(self.object['width'])
			.drawSectionBounds(false)
			.isometricMounts(true)
			.mount(self._objScene);

		//Create the background map
		self._backgroundImage = new IgeTextureMap()
			.id('background')
			.tileWidth($TILESIZE)
			.tileHeight($TILESIZE)
			.drawMouse(false)
			.texture(ige.gameTexture[self._type])
			.anchor(self.object['x_anchor'], self.object['y_anchor'])
			.dimensionsFromTexture()
			.mount(self._gameScene);

		// Collision map
		//self._colmap = new IgeMap2d();

		// Occupy all the border tiles
		// for (var x = 0; x < self.object['width'] + 1; x++) {
		// 	for (var y = 0; y < self.object['height'] + 1; y++) {
		// 		if(x == 0) {
		// 			var invisibleObj = new InvisibleBlock();
		// 			self._tilemap.occupyTile(x, y, 1, 1, invisibleObj);
		// 		}
		// 	}
		// }

		// Occupy all blocked titles as needed
		var blockedTiles = self.object['blocked_tiles'];
		if(typeof blockedTiles != 'undefined') {
			for (var i = blockedTiles.length - 1; i >= 0; i--) {
				var invisibleObj = new InvisibleBlock();
				self._tilemap.occupyTile(blockedTiles[i]['x'], blockedTiles[i]['y'], 1, 1, invisibleObj);
			}
		}

		// Generate Carpet Tiles
		if(typeof self.object['draw_floor'] === 'undefined' || self.object['draw_floor'] == true) {
			var texIndex = self._texMap.addTexture(ige.gameTexture.carpetTest);
			for (var x = 0; x < self.object['width']; x++) {
				for (var y = 0; y < self.object['height']; y++) {

					//Make sure the tile isnt blocked
					if(typeof blockedTiles != 'undefined') {
						var isBlocked = false;
						for (var i = 0; i < blockedTiles.length; i++) {
							if(x === blockedTiles[i]['x'] && y == blockedTiles[i]['y']) {
								isBlocked = true;
							}
						}

						if(isBlocked == false) {
							self._texMap.paintTile(x, y, texIndex, 1);
						}
					} else {
						//console.log('painting x: ' + x + ', y: ' + y);
						self._texMap.paintTile(x, y, texIndex, 1);
					}
				}
			}
		}

		var startCords = self.playerStartCords();

		//Spawn doorway overlay
		var doortop = new IgeEntity()
			.isometric(true)
			.texture(ige.gameTexture.entry_top)
			.dimensionsFromTexture()
			.mount(self._tilemap)
			.anchor(-20, -102)
			.layer(0)
			.translateToTile(startCords.x, startCords.y, 0);

		//Spawn doorside overlay
		var doorside = new IgeEntity()
			.isometric(true)
			.texture(ige.gameTexture.entry_side)
			.dimensionsFromTexture()
			.mount(self._tilemap)
			.anchor(15, -38)
			.layer(0)
			.translateToTile(startCords.x, startCords.y, 0);

		// var leftWallX = (self._tilemap.wallXOffset() * -1),
		// 	rightWallX = self._tilemap.wallXOffset(),
		// 	leftWallY = (self._tilemap.wallYOffset());

		//Generate Left Walls
		// for (var width = 0; width < self.object['width']; width++) {
		// 	var x = leftWallX + width * $TILESIZE,
		// 		y = leftWallY - width * ($TILESIZE / 2);

		// 	new IgeEntity()
		// 		.isometric(true)
		// 		.texture(ige.gameTexture.leftWall)
		// 		.dimensionsFromTexture()
		// 		.anchor(x, y)
		// 		.mount(self._objScene);
		// }

		//Generate Right Walls
		// for (var height = 0; height < self.object['height']; height++) {
		// 	x = rightWallX + height * $TILESIZE;

		// 	new IgeEntity()
		// 		.isometric(true)
		// 		.texture(ige.gameTexture.leftWall)
		// 		.dimensionsFromTexture()
		// 		.anchor(x, 0)
		// 		.mount(self._objScene);
		// }

		return this;
	},

	playerStartCords: function() {
		return this.object['player_start'];
	}
});
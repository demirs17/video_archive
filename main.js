const { app, BrowserWindow, ipcMain, shell } = require('electron')

const path = require("node:path")
var fs = require("fs");

const createWindow = () => {
	const win = new BrowserWindow({
		width: 600,
		height: 450,
		webPreferences: {
		  preload: path.join(__dirname, 'preload.js')
		}
	});

	win.loadFile('index.html');
}

const showVideoWindow = (name) => {
	const db = JSON.parse(fs.readFileSync("db.json").toString())
	const win = new BrowserWindow({
		width: 550,
		height: 400,
		webPreferences: {
			preload: path.join(__dirname, "preload_show.js")
		}
	});
	win.webContents.send("path", name);
	win.webContents.send("db", db);
	win.loadFile('show.html');
}


app.whenReady().then(() => {
	createWindow()
	
	ipcMain.handle("getFiles", async () => {
		const db = await JSON.parse(fs.readFileSync("db.json").toString());
		return {db: db};
	})
	
	ipcMain.handle("openInFolder", async (event, filepath) => {
		shell.showItemInFolder(path.join(__dirname, "videos", filepath))
	});
	
	ipcMain.handle("goToShowPage", async (event, name) => {
		showVideoWindow(name);
	});
	
	ipcMain.handle("getAllVideos", async () => {
		const files = await fs.promises.readdir("videos");
		return files;
	});

	ipcMain.handle("isVideoExists", (event, video) => {
		return fs.existsSync(path.join(__dirname, "videos", video));
	});
	
	ipcMain.handle("addTag", async (event, obj) => {
		//obj.tag obj.path
		const db = await JSON.parse(fs.readFileSync("db.json").toString());
		var videoJsondaKayitlimi = false;
		for(var i = 0;i<db.length;i++){
			if(db[i].name == obj.path){
				videoJsondaKayitlimi = true;
				for(var k = 0;k<obj.tags.length;k++){
					db[i].tags.push(obj.tags[k])
				}
				console.log(db);
			}
		}
		if(!videoJsondaKayitlimi){
			db.push({
				name: obj.path,
				tags: obj.tags
			});
		}
		fs.writeFileSync("db.json", JSON.stringify(db));
	});

	ipcMain.handle("deleteRecord", async (event, video) => {
		var db = await JSON.parse(fs.readFileSync("db.json").toString());
		db = db.filter(item => item.name !== video);
		fs.writeFileSync("db.json", JSON.stringify(db));
	});

	ipcMain.handle("deleteTag", async (event, obj) => {
		var tag = obj.tag;
		var video = obj.video;
		const db = await JSON.parse(fs.readFileSync("db.json").toString());
		for(var i = 0;i<db.length;i++){
			if(db[i].name == video){
				db[i].tags = db[i].tags.filter(function(item) {
					return item !== tag;
				});
				fs.writeFileSync("db.json", JSON.stringify(db));
				break;
			}
		}
	});
})
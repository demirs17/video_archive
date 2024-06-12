const filesDiv = document.getElementById('files');
const searchInput = document.getElementById("search");
const nonTaggedVideosAlert = document.getElementById("non-tagged-videosalert");
const nonTaggedVideosButton = document.getElementById("non-tagged-videos-button");

electronAPI.getFiles().then( async (data) => {
	var db = data.db;
	
	for(var i = 0;i<db.length;i++){
		filesDiv.innerHTML += await addToList(db[i]);
	}
	setButtonFunctions();
	
	searchInput.addEventListener("input", () => {
		filesDiv.innerHTML = "";
		var searchTerms = searchInput.value.trim().split(" ");
		for(var i = 0;i<db.length;i++){
			if (searchTerms.some(term => db[i].tags.includes(term) || db[i].tags.some(tag => tag.indexOf(term) !== -1))) {
				filesDiv.innerHTML += addToList(db[i]);
			}
		}
		setButtonFunctions();
	});
	
	nonTaggedVideosButton.onclick = () => {
		electronAPI.getAllVideos().then((videos) => {
			filesDiv.innerHTML = "";
			for(var i = 0;i<videos.length;i++){
				var kayitVarmi = false;
				for(var j = 0;j<db.length;j++){
					if(videos[i] == db[j].name){
						kayitVarmi = true;
					}
					console.log("videos[i]: ", videos[i], " - ", "db[j].name: ", db[j].name, "kayitvarmi:", kayitVarmi);
					if(videos[i] == db[j].name && db[j].tags.length == 0){
						filesDiv.innerHTML += addToList(db[j]);
						setButtonFunctions();
					}
				}
				if(!kayitVarmi){
					filesDiv.innerHTML += addToList({name: videos[i], tags: []});
					setButtonFunctions();
				}
			}
		});
	}
});






async function addToList(file){
	var videoExists = await window.electronAPI.isVideoExists(file.name);
	// return '<div class="file">' + '<div class="tags">' + etiketleriYaz(file.tags) + '</div>' + '<div class="video-title">' + file.name + '</div>' + '<div class="buttons">' + '<button>dosya konumu</button>' + '<button>git</button>' + '</div>'+ '</div>';
	return `<div class="file">
				<div class="tags"> ${etiketleriYaz(file.tags)} </div>
				${!videoExists ? '<div class="video-yok-alert">video yok<br><button data-video="'+file.name+'" class="delete-record-button">sil</button></div>' : '<div></div>'}
				<div class="video-title"> ${file.name} </div>
				<div class="buttons">
					<button data-path="${file.name}" class="open-in-folder-button">dosya konumu</button>
					<button data-name="${file.name}" class="go-to-show-page-button">git</button>
				</div>
			</div>`;
}

function setUpOpenInFolderButtons(){
	document.querySelectorAll(".open-in-folder-button").forEach((elem, index) => {
		elem.onclick = () => {
			electronAPI.openInFolder(elem.dataset.path);
		}
	});
}

function setUpGoToShowPageButtons(){
	document.querySelectorAll(".go-to-show-page-button").forEach((elem) => {
		elem.onclick = () => {
			electronAPI.goToShowPage(elem.dataset.name);
		}
	});
}

function setUpDeleteRecordButtons(){
	document.querySelectorAll(".delete-record-button").forEach((elem) => {
		elem.onclick = () => {
			electronAPI.deleteRecord(elem.dataset.video);
		}
	});
}

function setButtonFunctions(){
	setUpOpenInFolderButtons();
	setUpGoToShowPageButtons();
	setUpDeleteRecordButtons();
}

function etiketleriYaz(tags){
	return tags.length == 0 ? " - NULL - " : tags.toString();
}


Vue.filter('icon', function(fileType) {
	s = "fa-"

	switch(fileType) {
		case "img":
			return s + "image"
	}
})

Vue.filter('src', function(val) {
	return "src(" + val + ")"
})

binder = new Vue({
	el: "#accordionExample",
	data: {
		contents: [
			{
				name: "India Homework 1886",
				fileType: "img",
				lastAccessed: "6 days ago"
			},
			{
				name: "Industrial Revolution Write Up",
				fileType: "img",
				lastAccessed: "2 days ago"
			},
			{
				name: "Industrial Revo. Handout",
				fileType: "img",
				lastAccessed: "seconds ago"
			}
		],
	},
	computed: {
		folders: function() {
			return $("#binderContent").text();
		}
	}
})

Vue.filter("modalTarget", function(value) {
	if (!this.modalActive) {
		this.modalActive = !this.modalActive;
		return "#searchModal"
	}
})

var search = new Vue({
	el: "#searchModal",
	data: {
		searchTerm: "",
		results: [],
		modalActive: false,
	}
})


upload = new Vue({
	el: "#uploadModal",
	data: {
		folders: [
			{
				name: "History",
				contents: 6,
			},
			{
				name: "English",
				contents: 4
			},
			{
				name: "Calculus",
				contents: 18
			}
		],
		location: "",
		currentFile: "",
	},
	methods: {
		previewFile: function() {
			var preview = document.querySelector('#img');
			var file    = document.querySelector('#files').files[0];
			var reader  = new FileReader();

			reader.onloadend = function () {
				preview.src = reader.result
			}

			if (file) {
				reader.readAsDataURL(file);
			} else {
				preview.src = "";
			}
		},
		src: function(src) {
			return 'src("' + src + '")'
		},
		upload: function() {
			$('#files').click()
		},
		clear: function() {
			$("#img")[0].src = ""
		},
		fileUpload: function() {

			var file = $("#files")[0].files[0];
        	var folder = this.currentFile;
        	for (i = 0; i < $("#files")[0].files.length; i++) {
        		uploadFile($("#files")[0].files[i], folder);
			}

		}
	}
})
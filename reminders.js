App = new Vue({
	el: "#app",
	filters: {
		id: function(value) {
			if (value) {
				return "#" + ( value.split(" ").join("-") )
			} else {
				return ""
			}
		},
		identified: function(value) {
			if (value) {
				return value.split(" ").join("-")
			} else {
				return ""
			}
		}
	},
	data: {
		binder: [
			{
				name: "Math Homework",
				lastChanged: new Date(),
				starred: false,
				contents: [{
					name: "Challenge Problem 2",
					lastViewed: "5 days ago",
					src: "img/math1.jpg",
					fileType: "img"
				},
				{
					name: "Challenge Problem 1",
					lastViewed: "3 days ago",
					src: "img/math2.jpg",
					fileType: "img"
				},
				{
					name: "EC 1",
					lastViewed: "minutes ago",
					src: "img/math3.jpg",
					fileType: "img"
				},
				],
			},
			{
				name: "SAT Answers",
				lastChanged: new Date(),
				starred: false,
				contents: [{
					name: "SAT Answers 1",
					lastViewed: "minutes ago",
					src: "img/SAT1.jpg",
					fileType: "img"
				},
				{
					name: "SAT Answers 2",
					lastViewed: "2 days ago",
					src: "img/SAT2.jpg",
					fileType: "img"
				},
				{
					name: "SAT Answers 3",
					lastViewed: "1 day ago",
					src: "img/SAT3.jpg",
					fileType: "img"
				},
				{
					name: "SAT Answers 4",
					lastViewed: "1 day ago",
					src: "img/SAT3.jpg",
					fileType: "img"
				},
				{
					name: "SAT Answers 5",
					lastViewed: "2 hours ago",
					src: "img/SAT3.jpg",
					fileType: "img"
				},
				]
			},
			{
				name: "SAT Prep",
				lastChanged: new Date(),
				starred: false,
				contents: [{
					name: "SAT Questions 1",
					lastViewed: "6 weeks ago",
					src: "img/1SAT.jpg",
					fileType: "img"
				},
				{
					name: "SAT Questions 2",
					lastViewed: "3 weeks ago",
					src: "img/2SAT.jpg",
					fileType: "img"
				},
				{
					name: "SAT Questions 3",
					lastViewed: "2 weeks ago",
					src: "img/3SAT.jpg",
					fileType: "img"
				},
				]
			},
			{
				name: "TSA Documents",
				lastChanged: new Date(),
				starred: false,
				contents: [{
					name: "LEAP Music Prod",
					lastViewed: "4 days ago",
					src: "img/leap.jpg",
					fileType: "img"
				},
				{
					name: "Music Production Overview",
					lastViewed: "2 weeks ago",
					src: "img/cop.jpg",
					fileType: "img"
				},
				{
					name: "SAT Questions 3",
					lastViewed: "2 weeks ago",
					src: "img/3SAT.jpg",
					fileType: "img"
				},
				]
			},
				

		],
		newFolderName: "",
		selectedFolder: "",
		selectedName: ""

	},
	methods: {
		previewFile: function() {
			var preview = document.querySelector('#img');
			var file    = $('#files')[0].files[0];
			var reader  = new FileReader();

			reader.onloadend = function () {
				preview.src = reader.result
			}

			if (file) {
				reader.readAsDataURL(file);
			} else {
			}
		},
		isDisabled: function() {
			return !!document.querySelector('#img').src && !!this.selectedFolder && !!this.selectedName
		},
		retakePicture: function(){
			$("#files").click()
		},
		notValidUpload: function() {
			return !!this.selectedFolder && !!document.querySelector("#img").src
		},
		makeFolder: function() {
			this.binder.push({
				name: this.newFolderName,
				lastChanged: new Date(),
				starred: false,
				contents: []
			})

			this.newFolderName = "";
		},
		clear: function() {
			this.selectedFolder = "";
		},
		find: function(name) {
			for(i = 0; i < this.binder.length; i++) {
				if (this.binder[i].name == name) {
					return i
				}
			}
		},
		uploadFile: function() {

			$("#uploadModal").modal("hide")

			s = this.selectedFolder;
			n = this.selectedName;

			console.log(s + "-" + n)

			this.selectedFolder = ""
			this.selectedName = ""

			this.binder[ this.find(s) ].contents.push({
					fileType: "img",
					name: n,
					lastViewed: "minutes ago"
				})

				window.setTimeout(function() {
					var preview = document.querySelector("#" + ( (s + " " + n).split(" ").join("-") ));
					var file    = document.querySelector("#files").files[0];
					var reader  = new FileReader();

					reader.onloadend = function () {
						preview.src = reader.result
					}

					if (file) {
						reader.readAsDataURL(file);
					} else {

					}
				}, 1000)

			
		}
	},
	computed: {
		selectedFile: function() {
			return !!document.querySelector("#img").src
		},
		validUpload: function() {
			return (!!this.selectedFolder && this.selectedFile)
		}
	}
})

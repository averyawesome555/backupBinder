
Vue.filter('icon', function(fileType) {
	s = "fa-"

	switch(fileType) {
		case "img":
			return s + "image"
	}
})

binder = new Vue({
	el: "#accordionExample",
	data: {
		folders: [
			{
				name: "History",
				contents: 6
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
		]
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

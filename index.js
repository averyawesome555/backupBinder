Vue.component('folder', {
  props: ['meta'],
  template: `

    <div class='row folder' :class="meta.color | getColor ">
      <div class='one column'></div>

      <div class='three columns name'>
        <h1>{{ meta.folderName }}</h1>
      </div>

      <div class="four columns data">
        <h3>{{ meta.subFolders }} {{"Folder" | pluralize(meta.subFolders)}}, {{meta.subItems}} {{"File" | pluralize(meta.subItems)}}</h3>
      </div>

      <div class="three columns icons">

      </div>

      <div class="one column"></div>

    </div>

  `
})

Vue.component('icon', {
	props: ['name'],
	template: "<i :class='name | icon'></i>"
})

Vue.filter('getColor', function(value) {

  colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger']

  randomColor = colors[Math.floor(Math.random() * colors.length)]

  return 'col-' + randomColor
})

Vue.filter('pluralize', function(item, value) {
  if (value == 1) {
    return item
  } else {
    return item + "s"
  }
})

Vue.filter("icon", function(value) {
	return "fas fa-" + value
})





Binder = new Vue({
  el: "#binder",
  data: {
    folders: [{
      folderName: 'english',
      dateCreated: '1 jan 2019',
      subFolders: 0,
      subItems: 2,
      color: 'blue',
    },
    {
      folderName: 'math',
      dateCreated: '18 may 2019',
      subFolders: 3,
      subItems: 1,
      color: 'green',
    },
    {
      folderName: 'histroy',
      dateCreated: '29 sept 2019',
      subFolders: 4,
      subItems: 6,
      color: 'red',
    },
    {
      folderName: 'film',
      dateCreated: '15 feb 2019',
      subFolders: 6,
      subItems: 0,
      color: 'yellow',
    },

    ]
  }

})

navbar = new Vue({
	el: "#navbar",
	data: {
		isActive: [true, false, false, false, false]
	},
	methods: {
		active: function(x) {
			this.isActive = [false, false, false, false, false];

			this.isActive[x] = true;
 		}
	}
})

recentFiles = new Vue({
	el: "#recentFiles",
	data: {
		recentFiles: [
			{
				thumbnail: "https://getuikit.com/v2/docs/images/placeholder_600x400.svg",
				fileName: "Homework Jan 2020",
				lastAccessed: "10 days ago"
			},
			{
				thumbnail: "https://getuikit.com/v2/docs/images/placeholder_600x400.svg",
				fileName: "Getem Bois",
				lastAccessed: "10 days ago"
			},
			{
				thumbnail: "https://getuikit.com/v2/docs/images/placeholder_600x400.svg",
				fileName: "Jan 2020",
				lastAccessed: "10 days ago"
			},
			{
				thumbnail: "https://getuikit.com/v2/docs/images/placeholder_600x400.svg",
				fileName: "Yote tote yute",
				lastAccessed: "10 days ago"
			}
		]
	}
})

recentFolders = new Vue({
	el: "#recentFolders",
	data: {
		recentFolders: [
			{
				thumbnail: "https://getuikit.com/v2/docs/images/placeholder_600x400.svg",
				fileName: "Homework Jan 2020",
				lastAccessed: "10 days ago"
			},
			{
				thumbnail: "https://getuikit.com/v2/docs/images/placeholder_600x400.svg",
				fileName: "Getem Bois",
				lastAccessed: "10 days ago"
			},
			{
				thumbnail: "https://getuikit.com/v2/docs/images/placeholder_600x400.svg",
				fileName: "Jan 2020",
				lastAccessed: "10 days ago"
			},
			{
				thumbnail: "https://getuikit.com/v2/docs/images/placeholder_600x400.svg",
				fileName: "Yote tote yute",
				lastAccessed: "10 days ago"
			}
		]
	}
})

starredItems = new Vue({
	el: "#starredItems",
	data: {
		starredItems: [
			{
				thumbnail: "https://getuikit.com/v2/docs/images/placeholder_600x400.svg",
				fileName: "Homework Jan 2020",
				lastAccessed: "10 days ago"
			},
			{
				thumbnail: "https://getuikit.com/v2/docs/images/placeholder_600x400.svg",
				fileName: "Getem Bois",
				lastAccessed: "10 days ago"
			},
			{
				thumbnail: "https://getuikit.com/v2/docs/images/placeholder_600x400.svg",
				fileName: "Jan 2020",
				lastAccessed: "10 days ago"
			},
			{
				thumbnail: "https://getuikit.com/v2/docs/images/placeholder_600x400.svg",
				fileName: "Yote tote yute",
				lastAccessed: "10 days ago"
			}
		]
	}
})
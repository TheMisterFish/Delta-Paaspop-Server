module.exports = {
	devServer: {
		disableHostCheck: true
	},
	css: {
		loaderOptions: {
			sass: {
				prependData: `$dark: #03004A; $yellow: #FFE600; $blue: #0000FF;`
			}
		}
	}
}
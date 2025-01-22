const moduleAlias = require('module-alias');

moduleAlias.addAliases({
	"@of-mono/common": `${__dirname}/packages/common/src`,
});

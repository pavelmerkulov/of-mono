// @todo instead this on we need to use loger from '@outfunnel/logger'
import { inspect } from 'util';

export const logger = {
	info(info: any) {
		console.log(inspect(info, {depth: null}));
	}
}
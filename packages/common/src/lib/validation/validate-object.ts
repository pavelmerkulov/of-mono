import { plainToClass } from 'class-transformer';
import { validate, ValidatorOptions } from 'class-validator';
import { ValidationError } from './validation.error';


function collectErrors(parentPath: string, error: any, errors: any[]) {
	const path = parentPath ? `${parentPath}.${error.property}` : error.property;

	if (error.children?.length) {
		error.children.forEach((child: ValidationError) => collectErrors(path, child, errors));
	} else {
		errors.push({
			value: error.value,
			property: path,
			constraints: error.constraints
		});
	}
}

export async function validateObject(obj: Object, validationClass: new() => {}, options: ValidatorOptions = {}) {
	const fixedObj = plainToClass(validationClass, obj);
	const validationErrors = await validate(fixedObj, {
		skipMissingProperties: true,
		forbidUnknownValues: false,
		validationError: { target: false },
		...options
	});

	const errors: { value: any; property: string; constraints: any }[] = [];
	validationErrors.forEach(err => collectErrors('', err, errors));

	if (errors.length > 0) {
		throw new ValidationError(undefined, { errors, inputData: obj });
	}
}
import Compressor from 'compressorjs';

const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const IS_BROWSER = typeof window !== 'undefined';
const IS_LOCAL_STORAGE_AVAILABLE = typeof localStorage !== 'undefined';

let token =
	IS_BROWSER && IS_LOCAL_STORAGE_AVAILABLE
		? localStorage.getItem('access-token')
		: null;

const getCategory = async (id: string) => {
	try {
		const res = await fetch(`${BaseUrl}/categories/${id}`);

		const result = await res.json();

		return {
			data: result,
			error: null,
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				data: null,
				error: error.message,
			};
		}
	}
};

const getCategories = async () => {
	try {
		const res = await fetch(`${BaseUrl}/categories`);

		if (!res.ok) {
			throw new Error('Error fetching data');
		}

		const result = await res.json();

		return {
			data: result.data,
			error: null,
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				data: null,
				error: error.message,
			};
		}
	}
};

const getCategoryWithProducts = async (categoryId: string) => {
	try {
		const res = await fetch(`${BaseUrl}/categories?_id=${categoryId}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		});

		const result = await res.json();

		return {
			category: result.data[0],
			subCategories: result.data[0].subCategories,
			products: result.data[0].products,
			error: null,
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				category: null,
				subCategories: null,
				products: null,
				error: error.message,
			};
		}
	}
};

const getSubCategoryWithProducts = async (subCategoryId: string) => {
	try {
		const res = await fetch(
			`${BaseUrl}/sub-categories?_id=${subCategoryId}`
		);

		const result = await res.json();

		return {
			subCategories: result.data[0],
			products: result.data[0].products,
			error: null,
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				subCategories: null,
				products: null,
				error: error.message,
			};
		}
	}
};

const getAllProducts = async () => {
	try {
		const res = await fetch(`${BaseUrl}/products`);

		const result = await res.json();

		return {
			products: result.data,
			error: null,
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				products: null,
				error: error.message,
			};
		}
	}
};

const getProduct = async ({ productId }: { productId: string }) => {
	try {
		const res = await fetch(`${BaseUrl}/products/${productId}`);

		const result = await res.json();

		return {
			data: result,
			error: null,
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				data: null,
				error: error.message,
			};
		}
	}
};

const uploadFile = async (files: FileList) => {
	try {
		const formData = new FormData();

		for (let i = 0; i < files.length; i++) {
			const compressedFile = await new Promise<File>(
				(resolve, reject) => {
					new Compressor(files[i], {
						quality: 0.6, // Adjust quality as needed
						success(result) {
							resolve(
								new File([result], files[i].name, {
									type: result.type,
								})
							);
						},
						error(error) {
							reject(error);
						},
					});
				}
			);

			formData.append(`files`, compressedFile);
		}

		const response = await fetch(`${BaseUrl}/upload`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
			},
			body: formData,
		});

		if (!response.ok) {
			throw new Error('Something went wrong...');
		}

		const result = await response.json();

		return {
			message: result.message,
			urls: result.urls,
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				urls: null,
				message: error.message,
			};
		}
	}
};

export const apiFunctions = {
	getCategory,
	getCategories,
	getCategoryWithProducts,
	getProduct,
	getAllProducts,
	uploadFile,
	getSubCategoryWithProducts,
	BaseUrl,
};

const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const FAKE_STORE_API = 'https://api.escuelajs.co';

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

		console.log('res', res);
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

const uploadFile = async (data: { file: File }) => {
	try {
		const formData = new FormData();
		formData.append('file', data.file);

		const response = await fetch(`${BaseUrl}/upload`, {
			method: 'POST',
			body: formData,
		});

		if (!response.ok) {
			throw new Error('Something went wrong...');
		}

		const result = await response.json();

		return {
			message: result.message,
			url: result.url,
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

const updateProfilePicture = async (file: File, userId: string) => {
	try {
		const uploadResult = await uploadFile({
			file,
		});

		if (!uploadResult || !uploadResult.url) {
			throw new Error('Upload failed');
		}

		const { url } = uploadResult;

		const response = await fetch(`${BaseUrl}/users/${userId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				profilePicture: url,
			}),
		});

		if (!response.ok) {
			throw new Error('Something went wrong');
		}

		return {
			success: true,
			message: null,
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

const update = async (data: {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
}) => {
	try {
		const response = await fetch(`${BaseUrl}/users/${data.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				email: data.email,
				firstName: data.firstName,
				lastName: data.lastName,
			}),
		});

		if (!response.ok) {
			throw new Error('Something went wrong');
		}

		return {
			success: true,
			message: null,
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

export const apiFunctions = {
	getCategory,
	getCategories,
	getCategoryWithProducts,
	getProduct,
	getAllProducts,
	BaseUrl,
	updateProfilePicture,
	update,
	getSubCategoryWithProducts,
};

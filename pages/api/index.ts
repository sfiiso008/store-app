const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const FAKE_STORE_API = 'https://api.escuelajs.co';

const IS_BROWSER = typeof window !== 'undefined';
const IS_LOCAL_STORAGE_AVAILABLE = typeof localStorage !== 'undefined';

let token =
	IS_BROWSER && IS_LOCAL_STORAGE_AVAILABLE
		? localStorage.getItem('access-token')
		: null;

const getCategory = async (id: number) => {
	try {
		const res = await fetch(`${FAKE_STORE_API}/api/v1/categories/${id}`);

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
		const res = await fetch(`${FAKE_STORE_API}/api/v1/categories`);

		if (!res.ok) {
			throw new Error('Error fetching data');
		}

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

const getProducts = async (categoryId: number) => {
	try {
		const res = await fetch(
			`${FAKE_STORE_API}/api/v1/categories/${categoryId}/products`
		);

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

const getAllProducts = async () => {
	try {
		const res = await fetch(`${FAKE_STORE_API}/api/v1/products`);

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

const getProduct = async ({ productId }: { productId: number }) => {
	try {
		const res = await fetch(
			`${FAKE_STORE_API}/api/v1/products/${productId}`
		);

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
	getProducts,
	getProduct,
	getAllProducts,
	BaseUrl,
	updateProfilePicture,
	update,
};

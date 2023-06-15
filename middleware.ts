import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
	const session:any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

	if (
		req.nextUrl.pathname.startsWith('/checkout/summary') ||
		req.nextUrl.pathname.startsWith('/checkout/address')
	) {
		if (!session) {
			const requestedPage = req.nextUrl.pathname;
			const url = req.nextUrl.clone();
			url.pathname = `/auth/login`;
			url.search = `p=${requestedPage}`;
			return NextResponse.redirect(url);
		}
	}

	if (
		req.nextUrl.pathname.startsWith('/admin') ||
		req.nextUrl.pathname.startsWith('/admin/orders') ||
		req.nextUrl.pathname.startsWith('/admin/users')
	) {
		if (!session) {
			// const requestedPage = req.page?.name;
      const requestedPage = req.nextUrl.pathname;
			return NextResponse.redirect(`/auth/login?p=${requestedPage}`);
		}


		const validRoles = ['admin', 'super-user', 'SEO'];
		if (!validRoles.includes(session.user.role)) {
			return NextResponse.redirect('/');
		}
	}

	if (
		req.nextUrl.pathname.startsWith('/api/admin/dashboard') ||
		req.nextUrl.pathname.startsWith('/api/admin/orders') ||
		req.nextUrl.pathname.startsWith('/api/admin/products') ||
		req.nextUrl.pathname.startsWith('/api/admin/upload') ||
		req.nextUrl.pathname.startsWith('/api/admin/users')
	) {
		if (!session) {
			return new Response(JSON.stringify({ message: 'No autorizado' }), {
				status: 401,
				headers: {
					'Content-Type': 'application/json',
				},
			});
		}

		const validRoles = ['admin', 'super-user', 'SEO'];
		if (!validRoles.includes(session.user.role)) {
			return new Response(JSON.stringify({ message: 'No autorizado' }), {
				status: 401,
				headers: {
					'Content-Type': 'application/json',
				},
			});
		}
	}

	return NextResponse.next();
}

// See "Matching Paths" below to learn more
// export const config = {
// 	matcher: ['/checkout/address', '/checkout/summary'],
// };

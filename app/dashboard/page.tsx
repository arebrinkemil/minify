import { FC } from 'react';
import { cookies } from 'next/headers';

type DashboardProps = {};
type UrlType = {
    original_url: string;
    short_url: string;
    created_at: string;
    expires_at: string;
    views: number;
    max_views: null;
    full_short: string;
}

const Dashboard: FC<DashboardProps> = async ({}) => {
    let urls: UrlType[] = []
    
    try {
        const cookieString = cookies().getAll().map(({ name, value }) => `${name}=${value}`).join(";");

        const headers = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cookie": cookieString
            }
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/url`, headers);

        if (res.ok) {
            const { data } = await res.json();
            urls = (data.urls as UrlType[]).map(url => {
                return {
                    ...url,
                    full_short: `${process.env.NEXT_PUBLIC_BASE_URL}/url/${url.short_url}`
                }
            });
        }
    } catch (error: unknown) {
        if (error instanceof Error) (
            console.log(error)
        )
    }
    
  return <main className='mt-20 py-2 px-4 max-w-[1440px] mx-auto md:px-8 md:py-4'>
    <h1 className='font-bold text-4xl mb-8'>Dashboard</h1>
    <div className='flex flex-col gap-4'>
        {urls.map(url => (
            <a key={url.short_url} target='_blank' href={url.full_short}>
                {url.full_short}
            </a>
        ))}
    </div>
  </main>;
};

export default Dashboard;
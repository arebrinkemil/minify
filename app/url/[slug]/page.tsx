import { FC } from 'react';
import { redirect } from 'next/navigation'

type Params = {
  slug: string
}
type PageProps = {
  params: Params;
};

const Page: FC<PageProps> = async ({ params }) => {
  let url = null;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/url/${params.slug}`);
    const data = await response.json();

    if (data.success) {
      url = data.data.original_url
    }
  } catch (error) {
    console.error('Error fetching URL:', error);
  }

  if (url) redirect(url)

  return <div className='text-black h-screen flex justify-center items-center'>Redirecting...</div>;
};

export default Page;
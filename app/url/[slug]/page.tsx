import { redirect } from 'next/navigation'



export default async function Page({ params }: { params: { slug: string } }) {
    let url = null;
        try {
            console.log('Fetching URL:', `${process.env.NEXT_PUBLIC_BASE_URL}/api/url/${params.slug}`)
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/url/${params.slug}`);
          const data = await response.json();
  
          if (data.success) {
            console.log('Redirecting to:', data.data.original_url)
            url = data.data.original_url;
           
          } else {
            console.error('URL not found or another error occurred:', data.error);
          }
        } catch (error) {
          console.error('Error fetching URL:', error);
        }


        if(url) {
            redirect(url)
        }
     
      
  

  return <div>Redirecting...<p>test</p></div>;
}



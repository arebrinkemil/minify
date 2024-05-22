import { FC } from 'react';

type DashboardProps = {};

const Dashboard: FC<DashboardProps> = async ({}) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/url`, {
            headers: {
                "Conten-Type": "application/json"
            }
        });
        const data = await res.json();
    
        if (data) console.log("data", data);
        console.log({res, data})
    } catch (error: unknown) {
        if (error instanceof Error) (
            console.log(error)
        )
    }
    
  return <main className='mt-20 py-2 px-4 max-w-[1440px] mx-auto md:px-8 md:py-4'>Dashboard</main>;
};

export default Dashboard;
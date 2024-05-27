import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import HomeMenu from '@/components/made/HomeMenu'

const Home = () => {
  return (
    <main className='mx-auto flex max-w-[1440px] flex-col gap-8 p-4 md:gap-16'>
      <header className='flex flex-col items-center justify-center gap-2'>
        <h1 className='text-6xl font-bold'>Minify</h1>
        <p className='text-lg'>Easily shorten your url with minify</p>
      </header>
      <section className='mx-auto flex w-full max-w-[800px] flex-col gap-4 md:gap-10'>
        <HomeMenu />
        <Accordion type='single' collapsible>
          <AccordionItem value='item-1'>
            <AccordionTrigger>What happens to my link</AccordionTrigger>
            <AccordionContent>
              All links are stored in our Database and then removed when their
              timer runs out.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-2'>
            <AccordionTrigger>For how long is it active?</AccordionTrigger>
            <AccordionContent>
              For as long as you choose in the form field!
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-3'>
            <AccordionTrigger>
              Will anyone else have access to my link?
            </AccordionTrigger>
            <AccordionContent>
              No your link is secure with us and will not be accessible for
              other users.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-4'>
            <AccordionTrigger>
              What does max amount of clicks mean?
            </AccordionTrigger>
            <AccordionContent>
              If your max amount of clicks is 5, after the link has been clicked
              5 times it will expire.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </main>
  )
}

export default Home

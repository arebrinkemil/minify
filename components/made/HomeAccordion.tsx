import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const HomeAccordion = () => {
  return (
    <Accordion type='single' collapsible className='pt-8'>
      <AccordionItem value='item-1'>
        <AccordionTrigger>What happens to my link</AccordionTrigger>
        <AccordionContent style={{ maxWidth: '320px' }}>
          All links are stored in our Database and then removed when their timer
          runs out.
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
        <AccordionContent style={{ maxWidth: '320px' }}>
          No your link is secure with us and will not be accessible for other
          users.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='item-4'>
        <AccordionTrigger>
          What does max amount of clicks mean?
        </AccordionTrigger>
        <AccordionContent style={{ maxWidth: '320px' }}>
          If your max amount of clicks is 5, after the link has been clicked 5
          times it will expire.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default HomeAccordion

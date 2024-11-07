import SearchForm from "@/components/SearchForm";
import StartupCard from "@/components/StartupCard";


export default async function Home({searchParams}: {
  searchParams: Promise<{query?: string}>}) {

  const query =(await searchParams).query;

  const posts = [{
    _createdAt: Date(),
    views: 55,
    author: { _id: 1, name:'Lovi'},
    _id: 1,
    description: 'This is the description',
    image: "https://www.posist.com/restaurant-times/wp-content/uploads/2016/10/A-Detailed-Guide-On-Starting-A-Bakery-Business-In-India-In-2023.jpg",
    category: "Baked goods",
    title: "Coco Bakery"
  }]

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">Pitch Your Startup, <br/>
        Connect With Entrepreneurs</h1>

        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual Competitions.
        </p>

        <SearchForm query={query}/>
      </section>

      <section className="section-container">
        <p className="text-30-semibold">
          {query ? 
          `Search results for "${query}"`
          : 
          'All Startups'}
        </p>

        <ul className="mt-7 card_grid">
          { posts?.length > 0 ? (
              posts.map((post: StartupCardType, index: number) => (
                <StartupCard key={post?._id} post={post}/>
              ))
          ): (
            <p>No startups found</p>
          )}
        </ul>
      </section>
    </>
  )
}
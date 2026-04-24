import HeroBanner from '@/components/movie/HeroBanner'
import RowSlider from '@/components/movie/RowSlider'
import { 
  getTrending, 
  getPopularMovies, 
  getTopRatedMovies, 
  getActionMovies, 
  getComedyMovies 
} from '@/lib/tmdb'

import { getPinnedContent, getHiddenIds, filterHidden } from '@/lib/content-control'

export default async function Home() {
  const [
    trending,
    popular,
    topRated,
    action,
    comedy,
    pinned,
    hiddenIds
  ] = await Promise.all([
    getTrending(),
    getPopularMovies(),
    getTopRatedMovies(),
    getActionMovies(),
    getComedyMovies(),
    getPinnedContent(),
    getHiddenIds()
  ]);

  // Filter all rows
  const filteredTrending = filterHidden(trending, hiddenIds);
  const filteredPopular = filterHidden(popular, hiddenIds);
  const filteredTopRated = filterHidden(topRated, hiddenIds);
  const filteredAction = filterHidden(action, hiddenIds);
  const filteredComedy = filterHidden(comedy, hiddenIds);

  const featuredMovie = filteredTrending.length > 0 ? filteredTrending[0] : null;
  const trendingList = filteredTrending.length > 0 ? filteredTrending.slice(1) : [];

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <HeroBanner movie={featuredMovie} />
      
      <div className="mt-[-40px] md:mt-[-100px] z-20 relative space-y-12">
        {pinned.length > 0 && <RowSlider title="Featured Picks" movies={pinned} />}
        {trendingList.length > 0 && <RowSlider title="Trending Now" movies={trendingList} />}
        {filteredPopular.length > 0 && <RowSlider title="Continue Watching" movies={filteredPopular.slice(0, 5)} />}
        {filteredPopular.length > 0 && <RowSlider title="Popular on CineVerse" movies={filteredPopular} />}
        {filteredTopRated.length > 0 && <RowSlider title="Top Rated Masterpieces" movies={filteredTopRated} />}
        {filteredAction.length > 0 && <RowSlider title="Action Thrillers" movies={filteredAction} />}
        {filteredComedy.length > 0 && <RowSlider title="Comedy Hits" movies={filteredComedy} />}
      </div>
    </div>
  )
}

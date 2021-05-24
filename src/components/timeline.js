import Skeleton from 'react-loading-skeleton';
import usePhotos from '../hooks/use-photos';
import Post from './post';

export default function Timeline() {
  // get the logged in user's photos (custom hook)
  const { photos } = usePhotos();

  return (
    <div className="container col-span-2">
      {!photos ? (
        // on loading the photos, use react skeleton
        <Skeleton count={4} width={640} height={500} className="mb-5" />
      ) : photos?.length > 0 ? (
        // if we have photos, render them (create a post component)
        photos.map(content => <Post key={content.docId} content={content} />)
      ) : (
        // if no photos, tell user to follow people to see some photos
        <p className="text-center text-2xl">Follow people to see photos!</p>
      )}
    </div>
  );
}

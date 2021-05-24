import { firebase, FieldValue } from '../lib/firebase';

// check if username already exists in firestore
export async function doesUsernameExist(username) {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('username', '==', username)
    .get();

  return result.docs.map(user => user.data().length > 0);
}

export async function getUserByUsername(username) {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('username', '==', username)
    .get();

  return result.docs.map(item => ({
    ...item.data(),
    docId: item.id,
  }));
}

// get user from the firestore where userId === userId (passed from the auth)
export async function getUserByUserId(userId) {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('userId', '==', userId)
    .get();

  const user = result.docs.map(item => ({
    ...item.data(),
    docId: item.id,
  }));

  return user;
}

// get up to 10 profiles that the logged in user is not following
export async function getSuggestedProfiles(userId, following) {
  const result = await firebase.firestore().collection('users').limit(10).get();

  return result.docs
    .map(user => ({
      ...user.data(),
      docId: user.id,
    }))
    .filter(
      profile =>
        profile.userId !== userId && !following.includes(profile.userId)
    );
}

// update the 'following' array of the logged in user
export async function updateLoggedInUserFollowing(
  loggedInUserDocId, // currently logged in user document id
  profileId, // the user that the logged in user requests to follow
  isFollowingProfile // true/false (is the logged in user currently following this person?)
) {
  return firebase
    .firestore()
    .collection('users')
    .doc(loggedInUserDocId)
    .update({
      following: isFollowingProfile
        ? FieldValue.arrayRemove(profileId)
        : FieldValue.arrayUnion(profileId),
    });
}

// update the 'followers' array of the user who has been followed
export async function updateFollowedUserFollowers(
  profileDocId, // the user who has been followed
  loggedInUserDocId, // currently logged in user who has made a follow request
  isFollowingProfile // true/false (is the logged in user currently following this person?)
) {
  return firebase
    .firestore()
    .collection('users')
    .doc(profileDocId)
    .update({
      followers: isFollowingProfile
        ? FieldValue.arrayRemove(loggedInUserDocId)
        : FieldValue.arrayUnion(loggedInUserDocId),
    });
}

// get the photos from the users that the logged in user is following
export async function getPhotos(userId, following) {
  const result = await firebase
    .firestore()
    .collection('photos')
    .where('userId', 'in', following)
    .get();

  const userFollowedPhotos = result.docs.map(photo => ({
    ...photo.data(),
    docId: photo.id,
  }));

  const photosWithUserDetails = await Promise.all(
    userFollowedPhotos.map(async photo => {
      let userLikedPhoto = false;
      // check if the user has liked the photo
      if (photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }
      const user = await getUserByUserId(photo.userId);
      const { username } = user[0];
      return { username, ...photo, userLikedPhoto };
    })
  );

  return photosWithUserDetails;
}

export async function getUserPhotosByUsername(username) {
  const [user] = await getUserByUsername(username);
  const result = await firebase
    .firestore()
    .collection('photos')
    .where('userId', '==', user.userId)
    .get();

  return result.docs.map(item => ({
    ...item.data(),
    docId: item.id,
  }));
}

export async function isUserFollowingProfile(
  loggedInUserUsername,
  profileUserId
) {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('username', '==', loggedInUserUsername)
    .where('following', 'array-contains', profileUserId)
    .get();

  const [response = {}] = result.docs.map(item => ({
    ...item.data(),
    docId: item.id,
  }));

  return response;
}

export async function toggleFollow(
  isFollowingProfile,
  activeUserDocId,
  profileDocId,
  profileUserId,
  followingUserId
) {
  // 1st param: logged in user's doc id
  // 2nd param: followed user's user id
  // 3rd param: is the user following this profile? (true/false)
  await updateLoggedInUserFollowing(
    activeUserDocId,
    profileUserId,
    isFollowingProfile
  );
  // 1st param: logged in user's user id
  // 2nd param: followed user's doc id
  // 3rd param: is the user following this profile? (true/false)
  await updateFollowedUserFollowers(
    profileDocId,
    followingUserId,
    isFollowingProfile
  );
}

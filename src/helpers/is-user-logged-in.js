import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

export default function IsUserLoggedIn({
  user,
  loggedInPath,
  children,
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={({ location }) => {
        // if there is no user (logged out), show the child routes (login/sign-up)
        if (!user) {
          return children;
        }

        // if there is a user (logged in), redirect to the loggedInPath (dashboard)
        if (user) {
          return (
            <Redirect
              to={{
                pathname: loggedInPath,
                state: { from: location },
              }}
            />
          );
        }

        return null;
      }}
    />
  );
}

IsUserLoggedIn.propTypes = {
  user: PropTypes.object,
  loggedInPath: PropTypes.string.isRequired,
  children: PropTypes.object.isRequired,
};

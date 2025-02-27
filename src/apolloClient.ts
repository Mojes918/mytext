import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { persistCache } from "apollo3-cache-persist";
import { setContext } from "@apollo/client/link/context";
import { Auth } from "aws-amplify";

// 🌟 Global auth token cache
let authTokenCache = null;
const getAuthToken = async () => {
  try {
    if (authTokenCache) {
      return authTokenCache;
    }

    const session = await Auth.currentSession();
    authTokenCache = session.getIdToken().getJwtToken();
    return authTokenCache;
  } catch (error) {
    console.error("❌ Error fetching auth token:", error);
    return null;
  }
};

// 🔗 HTTP Link for GraphQL API
const httpLink = new HttpLink({
  uri: "https://zmw7k4basndbfklxvkqsmwp3pi.appsync-api.ap-south-1.amazonaws.com/graphql",
});

// 🔗 Authentication Middleware
const authLink = setContext(async (_, { headers }) => {
  const token = await getAuthToken();
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// 🌟 Apollo Client Singleton Setup
let apolloClient = null;
const setupApolloClient = async () => {
  if (apolloClient) return apolloClient;

  const cache = new InMemoryCache();

  try {
    await Promise.race([
      persistCache({ cache, storage: AsyncStorage }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Cache timeout")), 5000)),
    ]);
    console.log("✅ Apollo Cache Ready");
  } catch (error) {
    console.warn("⚠️ Error persisting cache:", error);
  }

  try {
    apolloClient = new ApolloClient({
      link: authLink.concat(httpLink),
      cache,
      connectToDevTools: true,
    });
    console.log("🚀 Apollo Client Initialized");
  } catch (error) {
    console.error("❌ Apollo Client setup failed:", error);
    return null;
  }

  return apolloClient;
};

export default setupApolloClient;
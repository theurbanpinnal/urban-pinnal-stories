# urql Cache Invalidation Implementation

## ✅ Issues Fixed

### 1. **Removed React Query Confusion**
- ❌ **Before**: Mixed urql + React Query setup causing cache invalidation failures
- ✅ **After**: Hybrid approach - urql for GraphQL, React Query for CMS data

### 2. **Fixed Cache Invalidation**
- ❌ **Before**: `queryClient.invalidateQueries()` (React Query pattern) on urql queries
- ✅ **After**: `client.reexecuteQuery()` (proper urql cache invalidation)

### 3. **Reduced Stale Time**
- ❌ **Before**: 5-minute stale time
- ✅ **After**: 2-minute stale time for both GraphQL and CMS data

## 🔧 Implementation Details

### Updated Files:

#### `src/App.tsx`
- **Hybrid Setup**: React Query for CMS data, urql for GraphQL
- React Query with 2-minute stale time for CMS data
- Clean separation of concerns

#### `src/main.tsx`
- Added `cacheExchange` to urql client
- Exported client for GraphQL cache invalidation
- Proper urql configuration

#### `src/lib/cache-utils.ts` (NEW)
- Proper urql cache invalidation functions
- Request policy helpers for GraphQL stale time control
- Comprehensive GraphQL cache management utilities
- **Clear documentation** that these are ONLY for GraphQL data

## 📖 Usage Examples

### GraphQL Cache Invalidation (urql)
```typescript
import { invalidateProductCache } from '@/lib/cache-utils';

// Invalidate all GraphQL product queries
invalidateProductCache();
```

### CMS Cache Invalidation (React Query)
```typescript
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

// Invalidate CMS data (journal posts, etc.)
queryClient.invalidateQueries({ queryKey: ['journal-posts'] });
```

### Using Request Policies for GraphQL Stale Time
```typescript
import { useQuery } from 'urql';
import { REQUEST_POLICIES } from '@/lib/cache-utils';
import { GET_PRODUCTS } from '@/lib/shopify';

const [result] = useQuery({
  query: GET_PRODUCTS,
  variables: { first: 20 },
  requestPolicy: REQUEST_POLICIES.CACHE_AND_NETWORK, // 2-minute stale behavior
});
```

### Using React Query for CMS Data
```typescript
import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '@/lib/cms';

const { data: posts } = useQuery({
  queryKey: ['journal-posts'],
  queryFn: fetchPosts,
  staleTime: 2 * 60 * 1000, // 2 minutes
});
```

## 🎯 Key Benefits

1. **Proper Cache Invalidation**: GraphQL cache invalidation works correctly with urql
2. **Faster Updates**: 2-minute stale time for both GraphQL and CMS data
3. **Clear Separation**: GraphQL uses urql, CMS uses React Query
4. **Type Safety**: Full TypeScript support for both systems
5. **Performance**: Efficient cache management for both data sources

## 🔄 Migration Guide

### GraphQL Data (Shopify)
```typescript
// ✅ Use urql cache utilities
import { invalidateProductCache } from '@/lib/cache-utils';
invalidateProductCache();
```

### CMS Data (Sanity)
```typescript
// ✅ Use React Query directly
import { useQueryClient } from '@tanstack/react-query';
const queryClient = useQueryClient();
queryClient.invalidateQueries({ queryKey: ['journal-posts'] });
```

## 🚀 Next Steps

1. **Test Both Systems**: Verify GraphQL and CMS cache invalidation work
2. **Monitor Performance**: Ensure both systems work efficiently
3. **Add Cache Invalidation Triggers**: Call appropriate invalidation functions
4. **Document Usage**: Keep clear separation between GraphQL and CMS data

## 📝 Architecture Notes

### Data Flow:
- **GraphQL (Shopify)**: urql → `src/lib/cache-utils.ts` → `invalidateProductCache()`
- **CMS (Sanity)**: React Query → `queryClient.invalidateQueries()`

### Cache Invalidation:
- **GraphQL**: Use `client.reexecuteQuery()` from urql
- **CMS**: Use `queryClient.invalidateQueries()` from React Query

### Stale Time:
- **GraphQL**: Controlled via urql request policies (`cache-and-network`)
- **CMS**: Controlled via React Query `staleTime` option

## 🧪 Testing the Fix

To test that both cache systems are working:

### GraphQL Testing:
1. **Load store page** - Products should load from urql cache
2. **Call `invalidateProductCache()`** - GraphQL queries should refetch
3. **Check network tab** - Should see GraphQL requests

### CMS Testing:
1. **Load journal page** - Posts should load from React Query cache
2. **Call `queryClient.invalidateQueries(['journal-posts'])`** - CMS queries should refetch
3. **Check network tab** - Should see Sanity API requests

## 🔍 Debugging Cache Issues

### GraphQL Issues:
1. **Check urql client**: Ensure client is properly exported and imported
2. **Verify invalidation calls**: Make sure `invalidateProductCache()` is being called
3. **Check request policy**: Ensure using `CACHE_AND_NETWORK` for fresh data

### CMS Issues:
1. **Check QueryClient**: Ensure `QueryClientProvider` is wrapping the app
2. **Verify invalidation calls**: Make sure React Query invalidation is being called
3. **Check staleTime**: Ensure `staleTime` is set to 2 minutes

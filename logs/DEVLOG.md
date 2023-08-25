Strange error occuring during clientside fetching with useQuery and tRPC. The issue turned out to be this. Perhaps because .env values are not allowed in client side?

```ts
apiClientside.createClient({
    links: [
        httpBatchLink({
            url: `${env.NEXTAUTH_URL}/api/trpc`,
        }),
    ],
    transformer: SuperJSON,
})
```

The issue went away with this.
```ts
apiClientside.createClient({
    links: [
        httpBatchLink({
            url: `http://localhost:3000/api/trpc`,
        }),
    ],
    transformer: SuperJSON,
})
```
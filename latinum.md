# Latinum
WHY?
> We believe conversations shouldn’t end in answers — they should end in action.

WHAT?
> Latinum is the connection between AI agents and the real-world economy.

HOW?
> Latinum is the transaction layer powering identity, payments, order orchestration, and trust between agents and sellers.


In the next few years, most online transactions will be made by AI agents on behalf of humans.
Latinum gives them the power to buy — safely, instantly, and autonomously. We turn conversations into transactions.

On the seller side, we provide everything needed to serve AI-native customers: user identification, order processing, delivery coordination, catalog search, availability handling, and payment settlement.

On the buyer side, we offer a wallet and identity layer that works with popular AI personal agents like ChatGPT, Siri, Claude, etc — allowing them to make purchases with user approval.

Latinum orchestration system routes each request to the best available provider — based on geography, price, availability, trust, and user preferences.


```mermaid
flowchart TD
    A[User]
    B[AI Agent - ChatGPT / Siri / Claude]
    C[Latinum Wallet - User Side]
    D[Latinum Orchestrator Server]
    E[Latinum Wallet - Seller Side]
    F[Sellers - E-commerce / Taxi / Food Delivery]

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F

    F --> E
    E --> D
    D --> C
    C --> B

    subgraph Buyer_Side
        A
        B
        C
    end

    subgraph Latinum_Core
        D
    end

    subgraph Seller_Side
        E
        F
    end
```

# Simplified Latinum Taxi

```mermaid
sequenceDiagram
    participant User
    participant AI as AI Agent
    participant Wallet as Latinum Wallet
    participant Orchestrator as Latinum Orchestrator
    participant Wrapper as Latinum Seller Wrapper
    participant SellerAPI as Seller Taxi System
    participant Driver as Driver

    %% Step 1: Request
    User->>AI: "I need a taxi"
    AI->>Wallet: Request to book a taxi

    %% Step 2: Find a Provider
    Wallet->>Orchestrator: Ask for available taxi services
    Orchestrator->>Wrapper: Look for offers
    Wrapper->>SellerAPI: Get availability and price
    SellerAPI-->>Wrapper: Respond with offer
    Wrapper-->>Orchestrator: Return offer
    Orchestrator-->>Wallet: Best option found

    %% Step 3: User Approves
    Wallet->>User: Show taxi offer
    User-->>Wallet: Approves the ride

    %% Step 4: Book Ride
    Wallet->>Wrapper: Confirm booking
    Wrapper->>SellerAPI: Place the order

    %% Step 5: Driver On The Way
    SellerAPI->>Driver: Assign the trip
    Driver-->>SellerAPI: Accepted
    SellerAPI->>Wrapper: Driver on the way
    Wrapper->>Wallet: Notify status
    Wallet->>AI: "Taxi is coming"
    AI->>User: "Your taxi is on the way"

    %% Step 6: Trip Complete
    Driver-->>SellerAPI: Trip completed
    SellerAPI->>Wrapper: Ride is done
    Wrapper->>Wallet: Confirm completion
    Wallet->>AI: Notify ride finished
    AI->>User: "Trip complete"
```

# Latinum Grocery delivery

```mermaid
sequenceDiagram
    participant User
    participant AI as AI Agent
    participant Wallet as Latinum Wallet
    participant Orchestrator as Latinum Orchestrator
    participant Wrapper as Latinum Seller Wrapper
    participant SellerAPI as Grocery Store API
    participant Delivery as Delivery Driver

    %% Step 1: Intent-Based User Request
    User->>AI: "Get ingredients for pasta carbonara"

    %% Step 2: Agent Breaks Down Intent
    AI->>AI: Parse intent → Lookup recipe
    AI->>AI: Create shopping list [pasta, eggs, pancetta, parmesan, pepper]

    %% Step 3: AI Sends Structured Request
    AI->>Wallet: Send grocery order (ingredient list)

    %% Step 4: Product Matching
    Wallet->>Orchestrator: Find store with ingredients
    Orchestrator->>Wrapper: Query product availability & price
    Wrapper->>SellerAPI: Search items in catalog
    SellerAPI-->>Wrapper: Return matched products
    Wrapper-->>Orchestrator: Aggregate results
    Orchestrator-->>Wallet: Return best match (store, price, slot)

    %% Step 5: User Approval
    Wallet->>User: "Ingredients found at $14. Delivery in 1 hour"
    User-->>Wallet: Approve purchase

    %% Step 6: Order and Delivery
    Wallet->>Wrapper: Confirm order
    Wrapper->>SellerAPI: Place order
    SellerAPI->>Delivery: Assign delivery
    Delivery-->>SellerAPI: Accepted
    SellerAPI->>Wrapper: Notify en route
    Wrapper->>Wallet: Track delivery
    Wallet->>AI: "Groceries on the way"
    AI->>User: "Carbonara ingredients arriving soon"

    %% Step 7: Completion
    Delivery-->>SellerAPI: Delivered
    SellerAPI->>Wrapper: Confirm success
    Wrapper->>Wallet: Notify complete
    Wallet->>AI: Final status
    AI->>User: "All ingredients delivered. Enjoy your meal!"
```




# Complete Latinum Taxi

```mermaid
sequenceDiagram
    participant User
    participant AI as AI Agent
    participant Wallet as Latinum Wallet (User)
    participant Orchestrator as Orchestrator
    participant Wrapper as Latinum Seller Wrapper
    participant SellerAPI as Seller Taxi API
    participant Driver as Driver App/System

    %% Step 1: Initial User Request
    User->>AI: "Get me a taxi to the airport"
    AI->>Wallet: Request via MCP (taxi, destination=airport)

    %% Step 2: Validate and Forward Request
    Wallet->>Wallet: Validate location, user identity
    alt Location missing
        Wallet->>AI: "Please confirm pickup location"
        AI->>User: "Where should I call the taxi from?"
        User->>AI: "From my current location"
    end
    Wallet->>Orchestrator: Request service providers

    %% Step 3: Orchestrator queries Wrapper
    Orchestrator->>Wrapper: Request taxi availability, ETA, price
    Wrapper->>SellerAPI: Query seller system
    SellerAPI-->>Wrapper: Return offers
    Wrapper-->>Orchestrator: Aggregate offers

    alt No providers available
        Orchestrator->>Wallet: No providers found
        Wallet->>AI: Notify unavailability
        AI->>User: "No taxis available. Try again later."
    else Offers received
        Orchestrator->>Orchestrator: Optimize by location, ETA, price, trust score
        alt Multiple offers
            Orchestrator->>Wallet: Return top 3 options
            Wallet->>AI: Show options
            AI->>User: "TaxiX $20 in 4 mins, TaxiY $18 in 6 mins?"
            User->>AI: "Choose TaxiX"
        else One clear best offer
            Orchestrator->>Wallet: Return best offer
        end
    end

    %% Step 4: User Approval
    Wallet->>User: Show approval popup
    alt User approves
        User-->>Wallet: Approve payment
        Wallet->>Wrapper: Send user ID, location, payment
        Wrapper->>SellerAPI: Place order
    else User declines
        Wallet->>AI: Notify cancellation
        AI->>User: "You didn’t approve. Try again?"
    end

    %% Step 5: Driver Assigned
    SellerAPI->>Driver: Assign trip
    Driver-->>SellerAPI: Confirm
    SellerAPI->>Wrapper: Send ETA
    Wrapper->>Wallet: Notify en route
    Wallet->>AI: Update status
    AI->>User: "Taxi arriving in 4 minutes"

    %% Step 6: Live Tracking
    loop Until pickup
        Driver-->>SellerAPI: GPS update
        SellerAPI->>Wrapper: ETA refresh
        Wrapper->>Wallet: Forward update
        Wallet->>AI: Status update
    end

    %% Step 7: Failures
    alt Driver cancels
        SellerAPI->>Wrapper: Cancel
        Wrapper->>Wallet: Notify
        Wallet->>AI: Update
        AI->>User: "Driver canceled. Try another?"
    end

    alt Major delay
        SellerAPI->>Wrapper: Delay info
        Wrapper->>Wallet: Notify delay
        Wallet->>AI: Alert
        AI->>User: "Taxi delayed. Cancel or wait?"
    end

    %% Step 8: Completion
    Driver-->>SellerAPI: Trip complete
    SellerAPI->>Wrapper: Completion signal
    Wrapper->>Wallet: Confirm
    Wallet->>AI: Notify
    AI->>User: "Trip complete."

    %% Step 9: Post-Trip Rating
    AI->>User: "Rate your ride?"
    alt User rates manually
        User-->>AI: "4 stars, driver late"
        AI->>Wallet: Submit rating
        Wallet->>Orchestrator: Store user review
    else Agent auto-rates
        Wallet->>AI: Actual ETA, price
        AI->>Orchestrator: Submit agent-generated rating (based on delta/expectation)
    end
```

# Press Release

Latinum has launched the first infrastructure platform built for the age of AI agents — enabling assistants like ChatGPT, Siri, and Claude to discover, trust, and transact directly with real-world businesses.
As AI agents rapidly become the primary interface for consumer intent, Latinum provides the critical bridge between agent and economy — turning intelligent requests into fulfilled transactions.
Latinum is the first platform built for agent-native commerce — enabling AI assistants to find, trust, and transact with real-world businesses.
For sellers, Latinum is a single integration that exposes their services to a growing network of intelligent agents — handling identity, catalog discovery, checkout, fulfillment, and trust.
For agents, Latinum provides a secure wallet with user-linked identity, location, and payment — plus access to an orchestration and rating engine that selects the best provider for every task, in real time.
> “We turn AI conversations into real-world transactions,” said Dennj Osele, CTO of Latinum.
“Latinum is the bridge between intelligent agents and the global economy.”

Unlike existing platforms designed for human interfaces, Latinum is built from the ground up for AI agents acting on human intent — making it the missing layer in agentic commerce.
The platform is now live with early partners including Shuppa, Manna Drones, and SuperValu, powering use cases like grocery delivery, local shopping, and instant logistics.



# Parallel with Shopify

Latinum is the Shopify for AI agents. Like Shopify, we manage product catalogs, expose search functionality, verify buyers, and process transactions. But instead of a human-facing UI, our services are built for AI agents — handling geographic restrictions, multi-provider orchestration, and fulfillment logic.
By removing the need for human interfaces, Latinum can also support taxi companies, food delivery services, and businesses with online booking systems.
Personal AI agents will be the access point to our services, much like browsers are the access point for Shopify. But, we don’t build an AI agent because we believe each phone will eventually have one default personal agent, just as every phone today has one browser.

**Why don’t we build our own AI agent?**
We expect AI agents to converge in capability and be dominated by smartphone OS providers: Google (Gemini), Apple (Siri), and Amazon (Alexa). Once Siri and Gemini match ChatGPT in intelligence, there’s little room — or user demand — for extra AI agent apps.
OpenAI, Anthropic, and Perplexity are already shifting toward professional agents, while Meta is pushing AI across its platforms to compete in the personal space.
Latinum is designed to be compatible with all major personal AI agents, but current support for third-party integrations is limited. Even innovative players like Anthropic have cumbersome installation systems.
We built a standalone Latinum app using OpenAI APIs, with our components pre-installed to address this. We'll continue supporting this app until major personal AI agents start offering an accessible integrations store.
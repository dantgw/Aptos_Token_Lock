# Vaultify

## Problem

Web3 projects have always muddled with opaque token management, with early investors and KOLs given locked tokens tied to several wallet addresses which are not supposed to be transacted. This is sometimes done on a trust basis without any transparency or accountability, which results in these supposedly "locked tokens" sold before the cliff or vesting schedule.

## Project Overview

Enter Vaultify, a product that implements a token locking and vesting system on the Aptos blockchain. It allows users to create token locks with customizable vesting schedules, view token unlock graphs, and claim vested tokens over time. We do not see this product being available within the Aptos ecosystem so we decided to build it to promote transparency and fairness.

Other potential use cases
- Passing down wealth to the next generation, and preventing them from squandering it due to the sudden influx of wealth.
- Retirement savings plan for the elderly to sustain their lifestyle. This is to prevent large withdrawals due to scams. 

## Key Features

1. **Token Locking**: Users can lock tokens intended for a particular address for a specified period with customizable vesting schedules.
2. **Vesting Schedules**: Supports cliff periods, vesting durations, and periodic releases.
3. **Token Unlock Graph**: Visual representation of token unlocks over time.
4. **Claim Function**: Allows users to claim vested tokens as they become available.
5. **Token Lock Management**: View and manage token locks by user or token address.

## Technical Stack

- **Blockchain**: Aptos
- **Smart Contract**: Move language
- **Frontend**: React with TypeScript
- **Data Visualization**: Visx (XYChart)
- **UI Components**: Tailwind and shadcn/ui

## Smart Contract Highlights

The `token_lock.move` contract includes:

- `add_token_lock`: Function to create new token locks
- `claim`: Function for users to claim vested tokens
- `get_token_locks_by_user`: View function to retrieve token locks for a specific user
- `get_token_locks_by_token_address`: View function to get token locks for a specific token

## How It Works

1. Users can input a token address to view existing locks displayed on a graph.
2. Users can view detailed information about each token lock in a table.
3. To create a new token lock, users can:
   - Enter the token address
   - Specify the amount of tokens to lock
   - Set a cliff timestamp
   - Choose a vesting duration (1 month to 10 years)
   - Select a claim periodicity (daily to annually)
   - Enter the claimant's address
4. Users can claim token locks which have been assigned to them


## Future Enhancements

- Add more detailed analytics and reporting features
- Integrate with popular token standards on Aptos
- Implement admin functions for managing token locks
- Add batch creation of token locks for efficient setup of multiple vesting schedules

## Conclusion

This token locking and vesting system provides a flexible and user-friendly way to manage token distributions on the Aptos blockchain. It's suitable for projects looking to implement vesting schedules for team tokens, investor allocations, or any other scenario requiring controlled token release over time.

## What tools does the project use?

- React framework
- Vite development tool
- shadcn/ui + tailwind for styling
- Aptos TS SDK
- Aptos Wallet Adapter
- Node based Move commands

## What Move commands are available?

The tool utilizes [aptos-cli npm package](https://github.com/aptos-labs/aptos-cli) that lets us run Aptos CLI in a Node environment.

Some commands are built-in the template and can be ran as a npm script, for example:

- `npm run move:publish` - a command to publish the Move contract
- `npm run move:test` - a command to run Move unit tests
- `npm run move:compile` - a command to compile the Move contract
- `npm run move:upgrade` - a command to upgrade the Move contract
- `npm run dev` - a command to run the frontend locally
- `npm run deploy` - a command to deploy the dapp to Vercel

For all other available CLI commands, can run `npx aptos` and see a list of all available commands.
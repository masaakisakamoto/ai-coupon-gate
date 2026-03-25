# ai-coupon-gate

A minimal coupon-based access control core for AI applications.

## Overview

ai-coupon-gate is a small, focused core library for validating coupon-based access to AI features.

It is designed for AI products that need:

- invite-only access
- usage limits
- expiration control
- inactive coupon blocking
- predictable validation results

This package focuses on the core validation contract, not UI, database, or framework lock-in.

## Why this exists

Many AI apps need a lightweight way to control who can use an expensive feature.

Typical needs include:

- protect API cost
- grant access to selected users
- run VIP or private invitations
- limit how many times a feature can be used
- block expired or inactive access

This package provides a clean validation core for that purpose.

## Design Principles

- database-agnostic
- framework-agnostic
- small surface area
- typed results instead of thrown validation errors
- testable pure core

## Current Core

### Types
- CouponRecord
- CouponValidationResult
- CouponValidationFailureReason

### Core Functions
- validateCouponRecord(coupon, options)
- validateCoupon(code, repository, options)

### Contract
- CouponRepository

## Validation Rules

A coupon is considered unusable when:

- it does not exist
- it is inactive
- it is expired
- its usage limit has been reached

Otherwise, it is valid.

## Example

    import { validateCoupon } from "./src/core/validateCoupon";

    const repository = {
      async getCouponByCode(code) {
        if (code === "VIP-ONLY") {
          return {
            code: "VIP-ONLY",
            isActive: true,
            maxUses: 10,
            usedCount: 2,
            expiresAt: new Date("2030-01-01"),
          };
        }

        return null;
      },
    };

    const result = await validateCoupon("vip-only", repository);

    if (!result.ok) {
      console.log(result.reason);
    } else {
      console.log(result.coupon.code);
    }

## Repository Contract

ai-coupon-gate does not know how your data is stored.

You provide a repository that implements:

    export interface CouponRepository {
      getCouponByCode(code: string): Promise<CouponRecord | null>;
    }

This makes the package reusable with:

- Supabase
- PostgreSQL
- MySQL
- SQLite
- DynamoDB
- in-memory stores
- custom backends

## Test Status

Current core test coverage includes:

- invalid coupon
- inactive coupon
- expired coupon
- usage limit reached
- valid coupon

## Project Status

This project is currently in early core-design stage.

The current priority is:

1. establish a strong validation contract
2. keep the core pure and reusable
3. provide examples for real AI apps
4. expand only when the contract stays clean

## Planned Next Steps

- add tests for validateCoupon
- add a simple in-memory repository example
- add a Next.js example app
- add usage recording contract separately
- add admin example separately

## Philosophy

This project is not trying to be a full billing system or authentication system.

It is a focused access-control layer for AI apps.

Small, explicit, and composable.

## License

MIT

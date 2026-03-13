# Company Multi-Tenancy Access Control

This module implements company-based multi-tenancy, ensuring users can only access companies they own or are members of.

## Components

### 1. `CompanyContextInterceptor`
**Location:** `interceptors/company-context.interceptor.ts`

Enriches `request.user` with company context after authentication:

```ts
request.user = {
  id: string,
  role: Role,
  companyIds: string[],      // Companies user owns OR is member of
  ownedCompanyIds: string[], // Companies user owns
}
```

### 2. `@CompanyAccess()` Decorator
**Location:** `decorators/company-access.decorator.ts`

Declares required access level and specifies which arg contains the company ID:

```ts
@CompanyAccess('owner', 'id')           // arg named 'id' is the company ID
@CompanyAccess('member', 'input.id')    // nested in input object
@CompanyAccess('owner', 'companyId')    // arg named 'companyId'
@CompanyAccess('member', 'input.company_id') // snake_case in input
```

### 3. `CompanyAccessGuard`
**Location:** `guards/company-access.guard.ts`

Validates company access based on `@CompanyAccess()` decorator:
- Extracts `companyId` using the path specified in the decorator
- **ADMIN role bypasses all checks**
- Returns error if user lacks required access

## Usage

### Basic Example

```ts
import { CompanyAccess } from './decorators/company-access.decorator'
import { CompanyAccessGuard } from './guards/company-access.guard'

// When company ID is in input.id
@UseGuards(AuthGuard, RolesGuard, CompanyAccessGuard)
@Roles('INVESTOR_ADMIN', 'ADMIN')
@CompanyAccess('owner', 'input.id')
@Mutation(() => Company)
async updateCompany(@Args('input') input: UpdateCompanyInput) {
  // Only company owner can reach here
}

// When company ID is a direct arg
@UseGuards(AuthGuard, CompanyAccessGuard)
@CompanyAccess('member', 'id')
@Query(() => Company)
async findOne(@Args('id') id: string) {
  // Owner or member can access
}

// For warehouse with company_id in input
@UseGuards(AuthGuard, CompanyAccessGuard)
@CompanyAccess('member', 'input.company_id')
@Mutation(() => Warehouse)
async createWarehouse(@Args('input') input: CreateWarehouseInput) {
  // ...
}
```

### Access Levels

| Level | Who Can Access |
|-------|----------------|
| `owner` | Only the company owner |
| `member` | Company owner OR any member |

### Accessing User Context

```ts
async someMethod(@Context('req') req: IAuthenticatedRequest) {
  const { id, role, companyIds, ownedCompanyIds } = req.user
  
  // Check if user owns a specific company
  const isOwner = ownedCompanyIds.includes(someCompanyId)
  
  // Check if user has access to a company
  const hasAccess = companyIds.includes(someCompanyId)
}
```

## Roles

| Role | Description |
|------|-------------|
| `INVESTOR` | Read-only, can only update own account |
| `INVESTOR_ADMIN` | Can manage owned companies |
| `ADMIN` | Full access, bypasses company checks |

## Extending to Other Modules

To add company access control to another module:

1. Import the guard and decorator:
```ts
import { CompanyAccess } from '../companies/decorators/company-access.decorator'
import { CompanyAccessGuard } from '../companies/guards/company-access.guard'
```

2. Ensure `CompanyContextInterceptor` runs (it's registered via `APP_INTERCEPTOR` in `CompaniesModule`)

3. Apply to resolver methods with the correct arg path:
```ts
// Direct arg
@UseGuards(AuthGuard, CompanyAccessGuard)
@CompanyAccess('member', 'companyId')
@Query(() => Warehouse)
async getWarehouse(@Args('companyId') companyId: string) {
  // ...
}

// Nested in input
@UseGuards(AuthGuard, CompanyAccessGuard)
@CompanyAccess('member', 'input.company_id')
@Mutation(() => Warehouse)
async createWarehouse(@Args('input') input: CreateWarehouseInput) {
  // ...
}
```

The second parameter of `@CompanyAccess()` is a dot-notation path to the company ID in the resolver args (e.g., `'id'`, `'companyId'`, `'input.id'`, `'input.company_id'`).

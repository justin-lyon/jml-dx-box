# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Salesforce SFDX project (`jml-dx-box`) that serves as Justin's running POC environment for various Salesforce development experiments. The project includes Lightning Web Components (LWC), Apex classes, Aura components, and custom metadata types.

## Common Development Commands

### Testing

- **Run all Apex tests**: `bash scripts/sf-cli/all-tests.sh` (uses `sf apex run test --test-level RunLocalTests`)
- **Run tests with coverage**: `bash scripts/sf-cli/all-tests.coverage.sh` (includes `--code-coverage --detailed-coverage`)
- **Run LWC unit tests**: `npm run test` or `npm run test:unit` (uses sfdx-lwc-jest)
- **Watch LWC tests**: `npm run test:unit:watch`
- **Debug LWC tests**: `npm run test:unit:debug`
- **LWC test coverage**: `npm run test:unit:coverage`

### Code Quality

- **Lint**: `npm run lint` (ESLint for aura/lwc components)
- **Format code**: `npm run prettier` (Prettier for cls, css, html, js, trigger files)
- **Check formatting**: `npm run prettier:verify`

### Salesforce CLI

- **Deploy to org**: Use `sf project deploy` commands
- **Run single test class**: `sf apex run test --class-names TestClassName`

## Architecture & Structure

### Package Directories

- `force-app/` - Main source code (default package)
- `examples/` - Example implementations and patterns

### Core Utilities

Located in `force-app/main/default/classes/utils/`:

- **Toolbox.cls**: Schema utilities, record type helpers, ID operations
- **CollectionsUtil.cls**: SObject collection manipulation with field tokens (filtering, mapping, set operations)
- **DmlService.cls**: Centralized DML operations wrapper
- **AsyncAction.cls**: Asynchronous operation patterns
- **TriggerBypass.cls**: Trigger bypass mechanism using custom metadata
- **DateUtil.cls**: Date/time utilities
- **PricebookSingleton.cls**: Singleton pattern for Pricebook access

### Service Layer Architecture

- **Aura Services** (`classes/auraServices/`): Backend services for Aura components
- **Repositories** (`classes/repositories/`): Data access layer (AccountRepo, TriggerBypassRepo)
- **DML Services** (`classes/dml/`): Including async DML operations in `dml/async/`
- **Proxies** (`classes/proxies/`): Wrapper classes for Salesforce result types

### Lightning Web Components

Located in `force-app/main/default/lwc/`:

- **Utility Components**: `utils/`, `debouncify/`, `navigator/`
- **UI Components**: `modal/`, `star/`, `starRating/`, `textarea/`, `timeInput/`
- **Data Components**: `lookup/`, `picklist/`, `dependentPicklist/`
- **Map Integration**: `leafletMap/` (uses Leaflet static resource)
- **Demo Containers**: `baseDemoContainer/`, `fieldDemoContainer/`, `wipContainer/`

### Static Resources

- **FontAwesome**: Complete FontAwesome icon library
- **Leaflet**: Mapping functionality
- **LightningKit**: Custom JavaScript utilities

### Custom Metadata Types

- **Dragon\_\_mdt**: Example metadata with fields for Breath, Color, Size
- **TriggerBypass\_\_mdt**: Controls trigger execution per object type

### Testing Structure

- Apex tests in `force-app/test/default/classes/` mirror main class structure
- LWC tests use Jest with `@salesforce/sfdx-lwc-jest`
- Mock utilities in `force-app/test/jest-mocks/`

## Development Patterns

### Field Tokens Usage

The codebase uses field tokens (SObjectField) extensively in CollectionsUtil for type-safe field access. When working with this pattern, always use `fieldToken.getDescribe().getName()` to get field names.

### Trigger Bypass Pattern

Custom metadata-driven trigger bypass system allows selective trigger disabling per object type via TriggerBypass\_\_mdt records.

### Async Operations

Async DML operations use a base class pattern (`AsyncDmlBase.cls`) with specific implementations for each DML type.

### LWC Demo Structure

The project includes a Lightning Console app with tabs for different POCs:

- Base Demo: Base component demonstrations
- Field Demo: Custom field component POCs
- WIP: Active development workspace

## Permission Sets

- **Admin**: Administrative access
- **LWCDemoApp**: Access to the LWC Demo console application

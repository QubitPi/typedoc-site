---
layout: "guide"
tags: tag
eleventyNavigation:
    key: "@category"
    parent: Tags
    order: 3
---

# @category

{% include 'tag-info', kind: 'Block' %}

The `@category` tag can be used to place several related API items under a common header when
listed in a page's index. It may be specified multiple times to list a reflection under several
headings.

## Example

```ts
/**
 * @category General Use
 */
export function runProcess(): void;

/**
 * @category Advanced Use
 */
export function unref(): void;

/**
 * @category Advanced Use
 */
export function ref(): void;
```

## See Also

-   The [`@group`](/tags/group/) tag
-   The [`--categorizeByGroup`](/options/organization/#categorizebygroup) option
-   The [`--defaultCategory`](/options/organization/#defaultcategory) option
-   The [`--categoryOrder`](/options/organization/#categoryorder) option
-   The [`--searchCategoryBoosts`](/options/output/#searchcategoryboosts) option

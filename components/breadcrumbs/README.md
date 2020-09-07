Wrapper around Material UI's breadcrumb component with some style changes. Automatically removes dead links.

## Variants

### Light theme

```tsx
<Breadcrumbs>
  <Breadcrumbs.Item action={{ model: "htmlLink", href: "/" }}>
    BMI Group
  </Breadcrumbs.Item>
  <Breadcrumbs.Item action={{ model: "htmlLink", href: "/products" }}>
    Products
  </Breadcrumbs.Item>
  <Breadcrumbs.Item>Roof</Breadcrumbs.Item>
  <Breadcrumbs.Item action={{ model: "htmlLink", href: "/tiles" }}>
    Tiles
  </Breadcrumbs.Item>
  <Breadcrumbs.Item>Concrete Tiles</Breadcrumbs.Item>
</Breadcrumbs>
```

### More than 5 items

```tsx
<Breadcrumbs>
  <Breadcrumbs.Item action={{ model: "htmlLink", href: "/BMI Group" }}>
    BMI Group
  </Breadcrumbs.Item>
  <Breadcrumbs.Item action={{ model: "htmlLink", href: "/BMI Zanda" }}>
    BMI Zanda
  </Breadcrumbs.Item>
  <Breadcrumbs.Item action={{ model: "htmlLink", href: "/Products" }}>
    Products
  </Breadcrumbs.Item>
  <Breadcrumbs.Item
    action={{ model: "htmlLink", href: "/Pitched Roof Products" }}
  >
    Pitched Roof Products
  </Breadcrumbs.Item>
  <Breadcrumbs.Item action={{ model: "htmlLink", href: "/Tiles" }}>
    Tiles
  </Breadcrumbs.Item>
  <Breadcrumbs.Item action={{ model: "htmlLink", href: "/Concrete Tiles" }}>
    Concrete Tiles
  </Breadcrumbs.Item>
  <Breadcrumbs.Item>Zanda Classic</Breadcrumbs.Item>
</Breadcrumbs>
```

### Long text breadcrumb

```tsx
<Breadcrumbs>
  <Breadcrumbs.Item action={{ model: "htmlLink", href: "/" }}>
    BMI Group
  </Breadcrumbs.Item>
  <Breadcrumbs.Item action={{ model: "htmlLink", href: "/sedum-green" }}>
    Extensive Sedum Green Roof System
  </Breadcrumbs.Item>
  <Breadcrumbs.Item>Tiles</Breadcrumbs.Item>
</Breadcrumbs>
```

### Dark theme

```tsx
<div style={{ padding: "10px", background: "#343850", color: "#fff" }}>
  <Breadcrumbs isDarkThemed>
    <Breadcrumbs.Item action={{ model: "htmlLink", href: "/" }}>
      Home
    </Breadcrumbs.Item>
    <Breadcrumbs.Item action={{ model: "htmlLink", href: "/Roofing" }}>
      Roofing
    </Breadcrumbs.Item>
    <Breadcrumbs.Item action={{ model: "htmlLink", href: "/Exterior" }}>
      Exterior
    </Breadcrumbs.Item>
    <Breadcrumbs.Item action={{ model: "htmlLink", href: "/icopal" }}>
      Icopal
    </Breadcrumbs.Item>
    <Breadcrumbs.Item action={{ model: "htmlLink", href: "/roofs" }}>
      Roofs
    </Breadcrumbs.Item>
    <Breadcrumbs.Item>Tiles</Breadcrumbs.Item>
  </Breadcrumbs>
</div>
```

### Deadlink removal

```tsx
<div style={{ padding: "10px", background: "#343850", color: "#fff" }}>
  <Breadcrumbs isDarkThemed>
    <Breadcrumbs.Item>Home</Breadcrumbs.Item>
    <Breadcrumbs.Item>Roofing</Breadcrumbs.Item>
    <Breadcrumbs.Item>Exterior</Breadcrumbs.Item>
    <Breadcrumbs.Item>Icopal</Breadcrumbs.Item>
    <Breadcrumbs.Item>Tiles</Breadcrumbs.Item>
  </Breadcrumbs>
</div>
```

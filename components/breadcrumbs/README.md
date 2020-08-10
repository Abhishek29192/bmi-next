Wrapper around Material UI's breadcrumb component with some style changes.

## Variants

### Light theme

```tsx
<Breadcrumbs>
  <Breadcrumbs.Item linkComponent="a" href="/">
    BMI Group
  </Breadcrumbs.Item>
  <Breadcrumbs.Item linkComponent="a" href="/products">
    Products
  </Breadcrumbs.Item>
  <Breadcrumbs.Item>Roof</Breadcrumbs.Item>
  <Breadcrumbs.Item linkComponent="a" href="/tiles">
    Tiles
  </Breadcrumbs.Item>
  <Breadcrumbs.Item>Concrete Tiles</Breadcrumbs.Item>
</Breadcrumbs>
```

### More than 5 items

```tsx
<Breadcrumbs>
  <Breadcrumbs.Item linkComponent="a" href="/BMI Group">
    BMI Group
  </Breadcrumbs.Item>
  <Breadcrumbs.Item linkComponent="a" href="/BMI Zanda">
    BMI Zanda
  </Breadcrumbs.Item>
  <Breadcrumbs.Item linkComponent="a" href="/Products">
    Products
  </Breadcrumbs.Item>
  <Breadcrumbs.Item linkComponent="a" href="/Pitched Roof Products">
    Pitched Roof Products
  </Breadcrumbs.Item>
  <Breadcrumbs.Item linkComponent="a" href="/Tiles">
    Tiles
  </Breadcrumbs.Item>
  <Breadcrumbs.Item linkComponent="a" href="/Concrete Tiles">
    Concrete Tiles
  </Breadcrumbs.Item>
  <Breadcrumbs.Item>Zanda Classic</Breadcrumbs.Item>
</Breadcrumbs>
```

### Long text breadcrumb

```tsx
<Breadcrumbs>
  <Breadcrumbs.Item linkComponent="a" href="/">
    BMI Group
  </Breadcrumbs.Item>
  <Breadcrumbs.Item linkComponent="a" href="/sedum-green">
    Extensive Sedum Green Roof System
  </Breadcrumbs.Item>
  <Breadcrumbs.Item>Tiles</Breadcrumbs.Item>
</Breadcrumbs>
```

### Dark theme

```tsx
<div style={{ padding: "10px", background: "#343850", color: "#fff" }}>
  <Breadcrumbs isDarkThemed>
    <Breadcrumbs.Item linkComponent="a" href="/">
      Home
    </Breadcrumbs.Item>
    <Breadcrumbs.Item>Icopal</Breadcrumbs.Item>
    <Breadcrumbs.Item linkComponent="a" href="/roofs">
      Roofs
    </Breadcrumbs.Item>
    <Breadcrumbs.Item>Tiles</Breadcrumbs.Item>
  </Breadcrumbs>
</div>
```

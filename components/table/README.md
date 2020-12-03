Both the normal size multi-column table table and reduced size (two column table) wraps [Material-UI Table component](https://material-ui.com/components/tables/), with few changes from the [BMI Style guide](https://xd.adobe.com/view/bfa83643-3e75-4a60-b8f4-f9f00b5fc8f1-eafb/screen/9a8276e2-f15e-43ae-8638-538210cd6caa/). The smallest reduced size renders `<ul>` or `<dl>` elements depends on whether table header is supplied.

The size of the content will dictate if the table enters a reduced mode, and which one it enters.

## Variants

### Default

```jsx
<Table>
  <Table.Head>
    <Table.Row>
      <Table.Cell>Informasjonskapsler</Table.Cell>
      <Table.Cell>Leverandør</Table.Cell>
      <Table.Cell>Beskrivelse</Table.Cell>
      <Table.Cell>Formål</Table.Cell>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>
        _ga
        <br />
        _gid
        <br />
        _gat
        <br />
        SC_ANALYTICS_GLOBAL_COOKIE
      </Table.Cell>
      <Table.Cell>GTM Google Sitecore </Table.Cell>
      <Table.Cell>Google Analytics*</Table.Cell>
      <Table.Cell>
        Disse informasjonskapslene brukes for å samle inn informasjon om hvordan
        besøkende bruker nettstedet vårt. Informasjonskapslene samler
        informasjon i et anonymt skjema, inkludert antall besøkende, hvor de
        besøkende besøker fra og sidene de besøkte.
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>
        addedDocsToBasket
        <br />
        addedDocsToBasketNode
      </Table.Cell>
      <Table.Cell>Front End</Table.Cell>
      <Table.Cell>For nedlasting av dokumenter</Table.Cell>
      <Table.Cell>
        Disse informasjonskapslene brukes av nettstedet til å lagre dokumentene
        som blir lagt til i nedlastingskurven.
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>ARRAffinity</Table.Cell>
      <Table.Cell>Azure</Table.Cell>
      <Table.Cell>Azure tjener Id</Table.Cell>
      <Table.Cell>
        Affinity informasjonskapsler brukes for å hjelpe de som må bruke en
        spesifikk versjon av en web-app eller nettside i Azure. Grunnen til
        dette er fordi vi streber etter "statløshet", men greier ikke alltid å
        oppnå det. Dette betyr at brukeren må holdes på den spesfikke instansen
        de bruke inntil de bryter ut og ting blir lagret på det tidspunkt.
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>ASP.NET_SessionId</Table.Cell>
      <Table.Cell>.Net</Table.Cell>
      <Table.Cell>Net Session Id</Table.Cell>
      <Table.Cell>
        ASP.Net_SessionId er en informasjonskapsel som brukes for å identifisere
        øktstatus på tvers av sideforespørsler på tjeneren. Denne
        informasjonskapselen er kun gyldig så lenge nettøkten pågår.
      </Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

### Table head with different ColorPair

```jsx
<Table theme="blue-900">
  <Table.Head>
    <Table.Row>
      <Table.Cell>
        <i>Lorem</i>
      </Table.Cell>
      <Table.Cell>ipsum</Table.Cell>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Lorem</Table.Cell>
      <Table.Cell>ipsum</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Lorem</Table.Cell>
      <Table.Cell>ipsum</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Lorem</Table.Cell>
      <Table.Cell>ipsum</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

### Table without header and border

```jsx
<Table hasNoBorder>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Lorem</Table.Cell>
      <Table.Cell>ipsum</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Lorem</Table.Cell>
      <Table.Cell>ipsum</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Lorem</Table.Cell>
      <Table.Cell>ipsum</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

### Specify row background color alternate pattern

```jsx
<Table theme="white" rowBgColorPattern="odd">
  <Table.Head>
    <Table.Row>
      <Table.Cell>Train station</Table.Cell>
      <Table.Cell>Year opened</Table.Cell>
      <Table.Cell>Served by</Table.Cell>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Llandudno</Table.Cell>
      <Table.Cell>1858</Table.Cell>
      <Table.Cell>Transport for Wales</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Llandybie</Table.Cell>
      <Table.Cell>1857</Table.Cell>
      <Table.Cell>Transport for Wales</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Llandudno Junction</Table.Cell>
      <Table.Cell>1858</Table.Cell>
      <Table.Cell>Transport for Wales</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Llanfairpwllgwyngyll</Table.Cell>
      <Table.Cell>1841</Table.Cell>
      <Table.Cell>Transport for Wales</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

### Reduced size - fixed two columns

Without enough space to render a multi-column table, it will render a fixed two-columns table instead.

```jsx
<div style={{ width: "350px" }}>
  <Table theme="blue-900">
    <Table.Head>
      <Table.Row>
        <Table.Cell>Train station</Table.Cell>
        <Table.Cell>Year opened</Table.Cell>
        <Table.Cell>Served by</Table.Cell>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      <Table.Row>
        <Table.Cell>Llandudno</Table.Cell>
        <Table.Cell>1858</Table.Cell>
        <Table.Cell>Transport for Wales</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Llandybie</Table.Cell>
        <Table.Cell>1857</Table.Cell>
        <Table.Cell>Transport for Wales</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Llandudno Junction</Table.Cell>
        <Table.Cell>1858</Table.Cell>
        <Table.Cell>Transport for Wales</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Llanfairpwllgwyngyll</Table.Cell>
        <Table.Cell>1841</Table.Cell>
        <Table.Cell>Transport for Wales</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
</div>
```

### Reduced size - list view

Table without header with always use list view for reduced size even if there is enough space.

```jsx
<div style={{ width: "350px" }}>
  <Table theme="blue-900">
    <Table.Body>
      <Table.Row>
        <Table.Cell>Llandudno</Table.Cell>
        <Table.Cell>1858</Table.Cell>
        <Table.Cell>Transport for Wales</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Llandybie</Table.Cell>
        <Table.Cell>1857</Table.Cell>
        <Table.Cell>Transport for Wales</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Llandudno Junction</Table.Cell>
        <Table.Cell>1858</Table.Cell>
        <Table.Cell>Transport for Wales</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Llanfairpwllgwyngyll</Table.Cell>
        <Table.Cell>1841</Table.Cell>
        <Table.Cell>Transport for Wales</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
</div>
```

### Reduced size - list view

Without enough space to render a multi-column table and also a fixed two-columns table, it will render a list view.

```jsx
<div style={{ width: "550px" }}>
  <Table>
    <Table.Head>
      <Table.Row>
        <Table.Cell>Train station</Table.Cell>
        <Table.Cell>Year opened</Table.Cell>
        <Table.Cell>Served by</Table.Cell>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      <Table.Row>
        <Table.Cell>Llandudno</Table.Cell>
        <Table.Cell>1858</Table.Cell>
        <Table.Cell>Transport for Wales</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Llandybie</Table.Cell>
        <Table.Cell>1857</Table.Cell>
        <Table.Cell>Transport for Wales</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Llandudno Junction</Table.Cell>
        <Table.Cell>1858</Table.Cell>
        <Table.Cell>Transport for Wales</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch
        </Table.Cell>
        <Table.Cell>1869</Table.Cell>
        <Table.Cell>Transport for Wales</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
</div>
```

### Not striped

```jsx
<Table rowBgColorPattern="none">
  <Table.Head>
    <Table.Row>
      <Table.Cell>Train station</Table.Cell>
      <Table.Cell>Year opened</Table.Cell>
      <Table.Cell>Served by</Table.Cell>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Llandudno</Table.Cell>
      <Table.Cell>1858</Table.Cell>
      <Table.Cell>Transport for Wales</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Llandybie</Table.Cell>
      <Table.Cell>1857</Table.Cell>
      <Table.Cell>Transport for Wales</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Llandudno Junction</Table.Cell>
      <Table.Cell>1858</Table.Cell>
      <Table.Cell>Transport for Wales</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>
        Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch
      </Table.Cell>
      <Table.Cell>1869</Table.Cell>
      <Table.Cell>Transport for Wales</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

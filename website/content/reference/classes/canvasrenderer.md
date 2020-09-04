---
id: "canvasrenderer"
title: "CanvasRenderer"
sidebar_label: "CanvasRenderer"
---

## Hierarchy

* **CanvasRenderer**

## Index

### Constructors

* [constructor](../canvasrenderer#constructor)

### Methods

* [registerDotClicked](../canvasrenderer#registerdotclicked)
* [registerKeyPressed](../canvasrenderer#registerkeypressed)
* [setDot](../canvasrenderer#setdot)
* [setText](../canvasrenderer#settext)

## Constructors

###  constructor

\+ **new CanvasRenderer**(`gridHeight`: number, `gridWidth`: number, `containerId?`: undefined | string): *[CanvasRenderer](../canvasrenderer)*

**Parameters:**

Name | Type |
------ | ------ |
`gridHeight` | number |
`gridWidth` | number |
`containerId?` | undefined &#124; string |

**Returns:** *[CanvasRenderer](../canvasrenderer)*

## Methods

###  registerDotClicked

▸ **registerDotClicked**(`dotClicked`: function): *void*

**Parameters:**

▪ **dotClicked**: *function*

▸ (`x`: number, `y`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |

**Returns:** *void*

___

###  registerKeyPressed

▸ **registerKeyPressed**(`keyPressed`: function): *void*

**Parameters:**

▪ **keyPressed**: *function*

▸ (`direction`: [Direction](../../enums/direction)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`direction` | [Direction](../../enums/direction) |

**Returns:** *void*

___

###  setDot

▸ **setDot**(`x`: number, `y`: number, `val`: [Color](../../enums/color)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |
`val` | [Color](../../enums/color) |

**Returns:** *void*

___

###  setText

▸ **setText**(`text`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`text` | string |

**Returns:** *void*

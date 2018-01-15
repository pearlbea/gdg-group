&lt;gdg-group&gt;
====

Install
----

Polyfill tags if you need them. This will include ShadowDOM and Custom Elements support.

```
<script src="https://unpkg.com/@webcomponents/webcomponentsjs@latest/webcomponents-sd-ce.js"></script>
```

Loading this component. It would be a good idea to use a specific version instead of `latest`.

```
<script src="https://unpkg.com/gdg-group@latest/dist/gdg-group.min.js"></script>
```

Usage
----

```
<gdg-group></gdg-group>

<gdg-group showNextEvent urlName="Pickle"></gdg-group>

<gdg-group>Slot content</gdg-group>
```



License
----

GdgGroup is released under an MIT license.

Built, tested, and published with [Nutmeg](https://nutmeg.tools).

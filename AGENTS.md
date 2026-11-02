# Architecture rules

- Preserve TanStack file routing and existing Akemi/SVG components rather than replacing the application.
- Keep original figure coordinates immutable; model and response grids share the same coordinates, columns and rows — the scale factor applies only to the physical cell size (CELL_BASE in src/data/desafios.ts), never to the vertices.
- Validate line coverage with merged collinear intervals, not segment counts, so subdivision and drawing direction do not affect correctness.
- Keep fixed circles separate from student segment state, so drawing tools cannot delete supplied geometry.
- Remember demonstration viewing only for the current browser session; this is presentation state, not stored student progress.
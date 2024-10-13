import React from "react";

const IconPlus = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <rect width="24" height="24" fill="url(#pattern0_26_5)" />
      <defs>
        <pattern
          id="pattern0_26_5"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_26_5" transform="scale(0.01)" />
        </pattern>
        <image
          id="image0_26_5"
          width="100"
          height="100"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAHn0lEQVR4nO1dS2xWRRQeTDTxgfhGQDYuVOiym6a23vt99/6/NakImm4UsOjGV6LGlYI0PhAIKzcGFF+AmrjCGGJAqUYNr9QNaUxEXYErLSACVqDUHDoktdJ/5v7/fcx///mSSZr29p5z57szc86ZM+cq5eHh4eHh4eHh4eHh4TEtqtXq/CiK4jAMnyK5GsB6kptIfqTbJvkdgJflGrlW/mf6O3pYo1KpXB1FUY/u4P0ATpIcr6fp/90HYF0YhvfKvT0VFujp6bkWwGMABkmeqZcAC4L+IbmbZH9nZ+dMT84UhGEY6CnndFYk1CDnFIBtJLtbnpg4jrtIfpU3CZy+fU/yfqXUjJYiB8A9JIccIGB8mlFzQF4WVXZUq9UbtFV0vuhOp7mJjlsqlcotqoyIouhRkkcd6OjxhKNlBMAyVRaIiUnyw5Q76gyAn2TaA/Alye3S9M/yu0NpW2kA3u/t7b1KNTMAtAH4scGOOKf9EPEhHoii6I729vbLTbLlGgB3yv9oX+aA3KtBYobjOF6gmhFRFIUAjjdAwi6SS+M4npWWTnIvAMtlJAEYq5OUY2KUqGYCySUk/67zYV8nOS9rHYMguA3AmjpfGnm2xaoZAGBFHVPDMZIvpTkabBEEwXUkVyYlRj9jv3IZABaRPJuQjE9Jzi5a9yAIbhUzN4lJLqSEYfiQcnXNSDhNHSYJ5RjCMIwAHEkyfTm3pmhrKsmQ3xEEwU3KUXR1dd0M4IskU64z1pf4GUlMWwCvNEmsaIYs+glIGXbCTwHwgaXC5wE8r5oMJJ9OYCK/60I4xGZUjAF4WDUpoih6JAEpSwtRUtYAAH9YKvmsanIAeNLy5RuRNcjlqepVVRJgwmm1IWVzEfsZNvb6jiwW8CiKbtf7KdM2uSZtuQMDA5dZWl+yXnaqvGC5uXQ4K9MWQJvFW9qWoUls46fsU3mA5H02b0iWTh8KJOSi82g5Q1RU1gDwnYUiWzLWoa1IQgQ6KcPUD9/kkR1iEyicXXZCuru75wD406RHpnvzJD+26IgXVcaAA4RoPVZZ6LE1yyS2UwbhxyWcrVqEkDiOZ+kZoZYeJzNJxiP5uMV09ZrKAXCEEK2LMd4lEY0sBA9abNhkvtPnGiF657FmWEW2jFMVKlFMnQ9bqxN2qpwAhwgRmLIvpe9STfCWLHSXgmpwjBDLIGt6Pok+h1FzuspzPxyOEdLV1XW9RR7B2tQESl6U4eH3pyasCQmxDCftTUvWDJJ/GR5+ncoRcJOQDQadTqQSaJUjYRYPv0jlCLhJyGKLdaRxK1TO6ZkESXqnanFC4jheYEFI4wFXfcCylpAzNrm2k0FyIYD2ehvJPouH72tQxsIkz9TX13eFRU7aE4kJuETnrTa8iYfquOewRYeOF9yG63iuXwx9tSrpPRMvVvVYWCUmZMjQV+tVowCw0aD47joULyUhAL423POtpPe8lJBtBiHbk96zrISQ/CzzULwnxD1C/JTl0pTlF3XHFnWT2Uvy5zruWco1BMCvmZu93jF0zDH0oRPHQieyRWkSJEePVYvHsjhx0LWmTnEcz01Dlg+/uxR+18L2Gd7GA6rFRwiAHwz67ElT2DqDsHN55GO5SogU1bE40PNGagKlLJ5FByxrVUIArDDpI8ZR2mlAo4YO2KVal5BBgy6jHR0dV6YqVNcorCV0TCwy1WKEVKvV+RaJcum/rFKc0qIT1qQu2HFCJL3HQpflqQsOguAaU6lWSc/3ydac2icnpe9UFrAIxUtbmYlwB0eIRZwv28NLUkrVoiOOy2GWshMSx/FccfZMeoRheLfKuDO+teiMbWUnBMAnFjoMqqxh45PIgUg5GFlWQkhWLPpgPMs++A8kVGLRIUeyqmiAAgmRsrEAfrOQn16oxLIitfFYsByyl8P2ZSocQHKnxXOLT9ah8gTJ92yGbV6+iSs+h25vq7wRRdGNJH+3VPA51eQIzSm1F1/AkcKKs0lA0VLJMSlxpJoUJJfalmcqvAyVVHy2HCWy5rygmgwkn0lAxjtF63shEpwki0RKHDVDib+BiQV8bYLnOph6RLfBDf6aB+inWl+FFPlKYNraWFOT2tEgCO5SLkHX0LIuEyt+Sm6OU0Knz8bPmNROO/utEfk6TdJCygA+d+FLat3d3XPqKaQM4EHlMqT8dtJS4xKQlKy+IMd9+clHmnXU1hgonEpGJiUzMjwAmbgYPyaIWZPHzqM+zLrWpsTSpaapvHPR0lpTrBf6KcSMSbkKeQPlDU55NPTLdnQDn6s46uyaYWl9NZRYjYnpb0gnoi0Ra0byaE2y5RotXzIKN0jeVAMkXNTloHPWVJ1+ilXci/btrM40H9KFXy588kj/PKT/lvQrDSYyNjvjZ6QYfhhJmZjxrJsUiy48HJIV9Bz+ZqNTB3P8bJ7LDmxqkCLDpnxhFjsq9uS+n+ECxFoRx7BoAvj/T6+2NjQxWxv5RHcDo0Fkbsk8O6QZ0dnZOVN8D/1Zu9EMSRiV9E7JKMwsia1s6J0wlys6BL43aWhjSjsh64IcCZAs9FKZr0WC5DwAlG95SOxLzq3IOXrJA9Ntoz7LslIOWMq1eVVK9fDw8PDw8PDw8PDwUE2KfwGczfNYVzEs4AAAAABJRU5ErkJggg=="
        />
      </defs>
    </svg>
  );
};

export default IconPlus;
